var Paypack = require("paypack-js");
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

admin.initializeApp();

Paypack.config({
  client_id: "c5ea6054-a5dc-11ee-9edc-deade826d28d",
  client_secret:
    "08e6da42879e26f379a68aab40a3dee0da39a3ee5e6b4b0d3255bfef95601890afd80709",
});

exports.onUserCreated = functions.auth.user().onCreate((user) => {
  return admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set({
      username: user?.displayName || "",
      photo: user?.photoURL || "",
      phone: user?.phoneNumber || "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
});

exports.onUserDeleted = functions.auth.user().onDelete((user) => {
  return admin.firestore().collection("users").doc(user.uid).delete();
});

exports.makeSubscriptionPayment = functions.https.onCall(
  async (data, context) => {
    if (context.auth && data.plan && data.phone) {
      if (context.auth && data.plan && data.phone) {
        const getAmount = (plan: any) => {
          return plan === "weekly"
            ? 2000
            : plan === "monthly"
            ? 5000
            : plan === "daily"
            ? 500
            : 100000;
        };
        const user = context.auth;

        return Paypack.cashin({
          number: data.phone,
          amount: getAmount(data.plan),
          environment: "production",
        })
          .then((e: any) => {
            return admin
              .firestore()
              .collection("subscriptions")
              .doc(user.uid)
              .collection("payments")
              .add({
                method: data.method,
                amount: getAmount(data.plan),
                transactionRef: e?.data?.ref,
                plan: data.plan,
                status: "pending",
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
                user: {
                  id: user.uid,
                  phone: user?.token?.phone_number || data.phone,
                  photo: user?.token.picture || "",
                },
              })
              .then((doc) => {
                return {
                  paymentId: doc.id,
                };
              });
          })
          .catch((e: any) => {
            throw new functions.https.HttpsError("aborted", e.message);
          });
      } else {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "The function must be called " + "while authenticated."
        );
      }
    } else {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called " + "while authenticated. or has no data"
      );
    }
  }
);

exports.paymentWebhook = functions.https.onRequest(
  async (req: any, res: any) => {
    const refId = req?.body?.data?.ref;
    const status = req?.body?.data?.status;

    if (refId) {
      const batch = admin.firestore().batch();
      const payment: any = await admin
        .firestore()
        .collectionGroup("payments")
        .where("transactionRef", "==", refId)
        .limit(1)
        .get()
        .then((e) => {
          if (e.empty) {
            return res.status(400).json({ message: "payment not found" });
          } else {
            return {
              ...e.docs[0].data(),
              id: e.docs[0].id,
            };
          }
        });

      if (payment.id) {
        if (status === "successful") {
          const getEndDate = (plan: any) => {
            const d = new Date();
            return plan === "weekly"
              ? new Date(d.setDate(d.getDate() + 7))
              : plan === "monthly"
              ? new Date(d.setMonth(d.getMonth() + 1))
              : plan === "daily"
              ? new Date(d.setDate(d.getDate() + 1))
              : new Date();
          };

          batch.set(
            admin.firestore().doc(`/subscriptions/${payment.user.id}`),
            {
              start: Timestamp.fromDate(new Date()),
              end: Timestamp.fromDate(getEndDate(payment.plan)),
              createdAt: FieldValue.serverTimestamp(),
              status: "active",
              plan: payment.plan,
              user: {
                id: payment.user.id,
                phone: payment.user.phone,
              },
              payment: {
                method: payment.method,
                id: payment.id,
                amount: payment.amount,
              },
            }
          );
        }

        batch.update(
          admin
            .firestore()
            .doc(`/subscriptions/${payment.user.id}/payments/${payment.id}`),
          {
            updatedAt: FieldValue.serverTimestamp(),
            status:
              status === "successful"
                ? "paid"
                : status === "failed"
                ? "failed"
                : status,
          }
        );

        await batch.commit();
        return res.json({ massage: "success" });
      } else {
        return res.status(400).json({ message: "payment not found" });
      }
    } else {
      return res.status(400).json({ message: "refid is required" });
    }
  }
);

exports.MakeAdmin = functions.https.onRequest(async (request, response) => {
  try {
    await admin
      .auth()
      .getUser(request.body.id)
      .then(({ customClaims: oldClaims }) =>
        admin.auth().setCustomUserClaims(request.body.id, {
          ...oldClaims,
          role: "admin",
        })
      );
    response.status(200).json("customtoken");
  } catch (err: any) {
    response.status(400).send(err.message);
  }
});
