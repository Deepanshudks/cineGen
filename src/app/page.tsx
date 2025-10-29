"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import heroImg from "@/public/cineGen.png";
import { Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  console.log(isSignedIn);

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [router]);

  const whyCineGen = [
    {
      title: "Seamless Video Production",
      desc: "Craft professional short videos effortlessly with our intuitive, AI-powered platform.",
      icon: "🎬",
    },
    {
      title: "Robust & Scalable",
      desc: "Leverage advanced cloud infrastructure for fast, scalable video rendering.",
      icon: "☁️",
    },
    {
      title: "Customizable Video Creation",
      desc: "Create tailored short videos using curated categories or custom prompts.",
      icon: "✨",
    },
  ];

  return (
    <>
      {isLoaded ? (
        <main className="flex flex-col min-h-screen font-sans bg-gray-100">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-blue-600 to-indigo-500 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/20 z-0" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-lg text-center lg:text-left"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  CineGen
                </h1>
                <p className="mt-4 text-lg sm:text-xl text-gray-200 leading-relaxed">
                  Transform your ideas into stunning short videos effortlessly,
                  quickly, and professionally.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    className="bg-gray-900 cursor-pointer font-semibold !rounded-full px-8 py-3 hover:bg-gray-100 hover:shadow-lg transition-all duration-300 text-zinc-50 hover:text-black"
                    onClick={() => router.push("/api/auth/signin")}
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-12 lg:mt-0"
              >
                <Image
                  src={heroImg}
                  alt="CineGen Preview"
                  width={400}
                  height={400}
                  className="rounded-2xl w-[70%] max-w-md mx-auto lg:max-w-none"
                />
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-16"
            >
              Why Choose CineGen?
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {whyCineGen?.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                >
                  <Card className="rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8"
            >
              Ready to create your masterpiece?
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <button
                className="bg-blue-600 text-white font-semibold rounded-full px-10 py-4 hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                onClick={() => router.push("/api/auth/signin")}
              >
                Start Creating Now
              </button>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-gray-300 py-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col  justify-center items-center">
              <p>© {new Date().getFullYear()} CineGen. All rights reserved.</p>
              <p className="text-xs">Developed by Kuldeep Gaud</p>
            </div>
          </footer>
        </main>
      ) : (
        // <div className="h-screen w-screen flex justify-center text-center items-center">
        //   <CircularProgress color="inherit" />
        // </div>
        <LoadingScreen />
      )}
    </>
  );
}
