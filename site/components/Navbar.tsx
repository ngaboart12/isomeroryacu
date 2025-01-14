import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useRef, useState } from "react";
import { Briefcase, User, UserPlus, LogOut, ArrowRight } from "react-feather";
import { useAuth } from "../context/authContext";
import { Avatar } from "./Avatar";
import Button from "./Button";

export default function Navbar() {
  const router = useRouter();

  const { user }: any = useAuth();

  const [callapsed, setcallapsed] = useState(false);

  return (
    <Fragment>
      <div
        className={`z-[1000] w-full fixed bg-[#FF9F00] border-b border-white border-opacity-25 ${
          router.pathname.split("/").includes("learn") && "hidden sm:block"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="px-3 py-3 relative sm:py-[8px] flex items-center justify-between w-full ">
            <div className="flex gap-3 items-center">
              <a
                className="bg-white hidden sm:block p-[10px] cursor-pointer rounded-full"
                onClick={() => {
                  setcallapsed(!callapsed);
                }}
              >
                <svg
                  version="1.1"
                  x="0px"
                  y="0px"
                  className="text-primary fill-current"
                  height={16}
                  width={16}
                  viewBox="0 0 1000 1000"
                  enableBackground="new 0 0 1000 1000"
                  xmlSpace="preserve"
                >
                  <g>
                    <path d="M990,210.3c0,38.7-31.3,70-70,70H80c-38.7,0-70-31.3-70-70l0,0c0-38.7,31.3-70,70-70H920C958.5,140.2,990,171.6,990,210.3L990,210.3L990,210.3z" />
                    <path d="M713.4,500c0,38.7-31.3,70-70,70H80c-38.7,0-70-31.3-70-70l0,0c0-38.7,31.3-70,70-70l563.3,0C682,430,713.4,461.3,713.4,500L713.4,500L713.4,500z" />
                    <path d="M503.4,789.7c0,38.7-31.3,70-70,70H80c-38.7,0-70-31.3-70-70l0,0c0-38.7,31.3-70,70-70h353.4C472.1,719.7,503.4,751.2,503.4,789.7L503.4,789.7L503.4,789.7z" />
                  </g>
                </svg>
              </a>
              <div className="flex items-center">
                <Link href={user ? `/learn` : `/`}>
                  <a className="mr-3 sm:mr-0">
                    <img className="h-[27px]" src="/images/logo.png" alt="" />
                  </a>
                </Link>
              </div>
              <ul className="flex items-center ml-3- sm:hidden">
                {[
                  { title: "ahabanza", link: user ? "/learn" : "/" },
                  { title: "abo turibo", link: "/about" },
                  { title: "twandikire", link: "/#contact" },
                ].map((e, index) => {
                  return (
                    <li key={index}>
                      <Link href={e.link}>
                        <a
                          className={`${
                            router.pathname === e.link
                              ? "text-white bg-white  bg-opacity-20 "
                              : "text-white hover:bg-white hover:bg-opacity-20"
                          } mx-1 font-medium capitalize rounded-[4px] px-4 py-2 truncate text-[15px]`}
                          href=""
                        >
                          {e.title}
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="hidden sm:block ">
              {user ? (
                <a
                  className="cursor-pointer"
                  onClick={() => {
                    router.push("/learn/account");
                  }}
                >
                  <Avatar
                    src={user?.photo}
                    className="cursor-pointer bg-gray-200"
                    size={33}
                    rounded
                    name={user?.username}
                  />
                </a>
              ) : (
                <div
                  onClick={() => {
                    router.push("/auth/login");
                  }}
                  className="bg-yellow-100 relative cursor-pointer bg-opacity-30 p-3 rounded-full  text-primary"
                >
                  <User size={18} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex sm:hidden sm:pt-3 sm:border-t sm:border-gray-400 sm:border-opacity-50 sm:w-full sm:items-start sm:flex-col items-center">
              <Actions
                user={user}
                setcallapsed={setcallapsed}
                callapsed={callapsed}
              />
            </div>
          </div>
          {callapsed && (
            <div className={`hidden bg-white sm:block`}>
              <ul
                className={`${
                  user && "sm:hidden"
                } flex border-t flex-col justify-start items-start ml-0`}
              >
                {[
                  { title: "ahabanza", link: "/" },
                  { title: "abo turibo", link: "/about" },
                  { title: "twandikire", link: "/#contact" },
                ].map((e, index) => {
                  return (
                    <Navlink key={index} setcallapsed={setcallapsed} e={e} />
                  );
                })}
              </ul>
              <ul
                className={`${
                  user && "sm:flex"
                } hidden border-t flex-col justify-start items-start ml-0`}
              >
                {[
                  {
                    title: "Ahabanza",
                    link: "/learn",
                  },
                  {
                    title: "Amasomo",
                    link: "/learn/lessons",
                  },
                  {
                    title: "amsuzuma bumenyi",
                    link: "/learn/tests",
                  },
                  {
                    title: "ifata buguzi",
                    link: "/learn/billing",
                    icon: Briefcase,
                  },
                  {
                    title: "Konte Yange",
                    link: "/learn/account",
                    icon: User,
                  },
                  {
                    title: "abafatabuguzi",
                    link: "/learn/subscribers",
                    strict: true,
                  },
                  {
                    title: "abantu",
                    link: "/learn/users",
                    strict: true,
                  },
                  {
                    title: "gusohoka",
                    link: "/learn/logout",
                    icon: LogOut,
                  },
                ].map((e, index) => {
                  return (
                    <Navlink key={index} setcallapsed={setcallapsed} e={e} />
                  );
                })}
              </ul>

              <Actions
                setcallapsed={setcallapsed}
                user={user}
                callapsed={callapsed}
              />
            </div>
          )}
        </div>
      </div>
      {callapsed && (
        <div
          className="cursor-pointer hidden z-[50] sm:block bottom-0 left-0 fixed right-0 top-0"
          onClick={() => {
            setcallapsed(false);
          }}
          style={{ backgroundColor: "rgb(10 10 10 / 55%)" }}
        />
      )}
    </Fragment>
  );
}

function Actions({ user, setcallapsed, callapsed }) {
  const router = useRouter();
  const { logout }: any = useAuth();

  const [loggingOut, setloggingOut] = useState(false);
  return (
    <div className="bg-primary w-full">
      {!user && (
        <div
          className={`${
            callapsed
              ? "sm:px-3 sm:border-t  sm:border-gray-200 sm:py-3"
              : "flex items-center"
          }`}
        >
          <Button
            onClick={() => {
              setcallapsed(false);

              router.push(`/auth/login`);
            }}
            className="mr-3- bg-white sm:w-full  sm:mb-3- sm:mr-0"
            small
            normal
            Icon={(size) => (
              <ArrowRight strokeWidth={2} className="ml-3" size={16} />
            )}
          >
            Tangira Kwiga
          </Button>
        </div>
      )}
      {user && (
        <Fragment>
          <div
            className={`flex ${
              !callapsed ? "sm:hidden sm:mx-3  ml-4" : "px-4"
            } ${
              callapsed && "sm:border-t sm:border-gray-200 sm:flex sm:flex-col"
            } text-gray-800 items-center sm:py-3`}
          >
            {user && router.asPath.split("/").includes("learn") && (
              <Button
                loading={loggingOut}
                onClick={() => {
                  setloggingOut(true);
                  setTimeout(() => {
                    router.push("/");
                    logout();
                    setcallapsed(false);
                    setloggingOut(false);
                  }, 1000);
                }}
                normal
                className="sm:flex bg-white  sm:w-full"
                Icon={LogOut}
              >
                Gusohoka
              </Button>
            )}
            {!router.asPath.split("/").includes("learn") && (
              <Button
                onClick={() => {
                  setcallapsed(false);

                  router.push(`/learn`);
                }}
                className="mr-3- bg-white sm:w-full sm:mb-3- sm:mr-0"
                small
                normal
                Icon={(size) => (
                  <ArrowRight strokeWidth={2} className="ml-3" size={16} />
                )}
              >
                Aho bigira
              </Button>
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
}

function Navlink({ e, setcallapsed }) {
  const { user }: any = useAuth();
  const router = useRouter();
  return (
    <li className={`${e?.strict && user?.role !== "admin" && "hidden"}`}>
      <a
        onClick={() => {
          router.push(e.link);
          setcallapsed(false);
        }}
        className={`${
          router.pathname === e.link ? "text-primary" : "text-gray-500"
        } px-5 py-4 cursor-pointer text-left block font-semibold sm:font-medium capitalize  text-sm`}
      >
        {e.title}
      </a>
    </li>
  );
}
