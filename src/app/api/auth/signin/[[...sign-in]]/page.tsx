import AboutCinegen from "@/app/components/AboutCinegen";
import { SignIn } from "@clerk/nextjs";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center bg-zinc-200 h-screen items-center p-6">
      <div className="md:flex justify-center hidden">
        <AboutCinegen />
      </div>
      <div className="flex justify-center">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full w-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-zinc-600"></div>
            </div>
          }
        >
          <SignIn />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
