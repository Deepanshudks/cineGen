"use client";
import React, { useEffect, useState } from "react";
import logoImage from "../../../public/cineGen.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { LinearProgress } from "@mui/material";
import ResponsiveDrawer from "../dashboard/_components/ResponsiveDrawer";
import SideNav from "../dashboard/_components/SideNav";

const Header = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    setIsWaiting(!isLoaded);
  }, [isLoaded]);

  return (
    <>
      <div className="z-50 p-2 fixed top-0 h-14 shadow-md bg-zinc-300  items-center w-full flex justify-between">
        <div className="flex justify-between">
          <ResponsiveDrawer>
            <SideNav />
          </ResponsiveDrawer>
          <Image
            onClick={() => router.push("/")}
            src={logoImage}
            height={50}
            width={120}
            alt="CineGen Logo"
          />
        </div>
        <div className="flex gap-4">
          {isSignedIn ? (
            <div
              onClick={() => {
                setIsWaiting(true);
              }}
              className="bg-primary text-white md:text-md text-base  cursor-pointer  hover:text-zinc-200 md:px-4 p-2 rounded-md"
            >
              <SignOutButton />
            </div>
          ) : (
            <div
              onClick={() => {
                setIsWaiting(true);
                router.push("/signin");
              }}
              className="bg-primary text-white md:text-md text-base  cursor-pointer  hover:text-zinc-200 md:px-4 p-2 rounded-md"
            >
              <SignInButton />
            </div>
          )}
          <UserButton />
        </div>
      </div>
      {isWaiting && <LinearProgress />}
    </>
  );
};

export default Header;
