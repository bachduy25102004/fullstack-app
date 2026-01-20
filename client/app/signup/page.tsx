"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import Link from "next/link";
import { FormEvent, useState } from "react";
import axios from "../configs/axiosConfig";
import { useRouter } from "next/navigation";

export default function Signup() {
  // const [mismatch, setMismatch] = useState(false);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const error =
    username.length < 7 ||
    password === "" ||
    confirmPassword === "" ||
    (confirmPassword.length > 0 && password !== confirmPassword);

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      
      e.preventDefault();
    //   const formData = new FormData(e.currentTarget);
    //   const username = formData.get("username");
    //   const pwd = formData.get("password");
    //   console.log(username, pwd);
      
      
      try {
        const res = await axios.post("/signup", {
          username,
          password,
        });
        if (res) {
          router.push('/')
        }
      } catch (e) {
        console.log(e);
      }
    }
   
  return (
    <div className="h-[calc(100vh-5rem)] flex items-center justify-center bg-linear-to-br from-zinc-100 via-white to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-lg border-muted/50">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Create an account
            </CardTitle>
            <CardDescription className="text-sm">
              Sign up to get started ✨
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  //   id="username"
                  placeholder="Your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`h-11 rounded-xl ${
                    username && username.length < 7 && "border-red-500"
                  }`}
                />

                {username && username.length < 7 && (
                  <p className="text-sm text-red-500 p-0 mb-0">
                    Username must be at least 7 characters long!!
                  </p>
                )}
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 rounded-xl"
                />
              </div> */}

              <div className="space-y-2 ">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2 ">
                <Label htmlFor="passwordConfirmation">
                  Password Confirmation
                </Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`h-11 rounded-xl ${
                    confirmPassword &&
                    (!mismatch ? "border-green-600" : "border-red-500")
                  }`}
                />

                {confirmPassword && (
                  <p
                    className={`text-sm  ${
                      mismatch ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {mismatch
                      ? "Uh oh… passwords do not match"
                      : "Looking good! "}
                  </p>
                )}
              </div>

              <Button
              type="submit"
                disabled={error}
                className="w-full h-11 rounded-xl text-base"
              >
                Sign up
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/?login=true"
                className="font-medium text-foreground hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
