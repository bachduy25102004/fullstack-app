"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../appContext";
import axios from "../configs/axiosConfig";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NavBar() {
  // const [loggedInUser, setLoggedInUser] = useState(null);
  const router = useRouter();
  const { currentUser, setCurrentUser } = useAppContext();
  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  async function onLogout() {
    try {
      const res = await axios("/logout");
      if (res) {
        setCurrentUser(null);
        router.push("/");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const pwd = formData.get("password");
    console.log(username, pwd);
    
    
    try {
      const res = await axios.post("/signup", {
        username,
        pwd,
      });
      if (res) {
        router.push('/')
      }
    } catch (e) {
      console.log(e);
    }
  }

  // useEffect(() => {
  //   fetch('http://localhost:4000/authen', {
  //     credentials: 'include',
  //   })
  //     .then((res) => {

  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log('nav data:', data);
  //       setLoggedInUser(data);
  //     });
  // }, [pathname]);

  return (
    <nav className="border-b bg-background ">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 ">
        <div className="flex flex-1 items-center gap-4  ">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight flex flex-row "
          >
            {/* <img
              src="../../static/logo1.png"
              alt=""
              className="bg-transparent h-10 w-10"
            /> */}
            <span className="text-[20px]">Home</span>
          </Link>

          {currentUser && (
            <>
              <Separator
                orientation="vertical"
                className="/bg-border w-3 mx-4 data-[orientation=vertical]:h-12"
              />
              <Button asChild variant="ghost" size="sm" className="text-[20px]">
                <Link href="/new-post" >New post</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-4">
          {currentUser ? (
            <>
              {/* <Avatar className="h-8 w-8">
              <AvatarFallback>
                {currentUser.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar> */}

              <span className="text-[20px] font-medium">
                Hello,{" "}
                <span className="hover:underline">
                  <Link href={`/${currentUser.username}`}>
                    
                    {currentUser.username}
                  </Link>
                </span>
              </span>

              <Separator
                orientation="vertical"
                className="/bg-border mx-4 data-[orientation=vertical]:h-12"
              />

              <Button variant="ghost" size="sm" onClick={onLogout} className="text-[20px]">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>Sign up</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Create an account</DialogTitle>
                    <DialogDescription>
                      Enter your details to get started
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        name="username"
                        placeholder="Your name...?"
                        required
                      />
                    </div>

                    <div className="space-y-2"></div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input name="password" type="password" required />
                    </div>

                    <Button type="submit" className="w-full">
                      Sign up
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </nav>

    // <nav
    //   style={{
    //     display: "flex",
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //   }}
    //   className="container mx-auto flex flex-row items-center gap-8"
    // >
    //   <div>
    //     <Link href="/">Home</Link>
    //   </div>

    //   <div>{currentUser && <Link href="/new-post">New post</Link>}</div>

    //   {currentUser ? (
    //     <>
    //       <div>Hello, {currentUser.username}</div>
    //       <div onClick={(e) => onLogout(e)}>
    //         Log out
    //       </div>
    //     </>
    //   ) : (
    //     <div style={{ margin: "15px" }}>
    //       <Link href="/login">Login</Link>
    //       <Link href="/signup">Sign up</Link>
    //     </div>
    //   )}
    // </nav>
  );
}
