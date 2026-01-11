"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Home
          </Link>

          {currentUser && (
            <>
              <div className="self-stretch w-px bg-border mx-2" />
              <Button asChild variant="ghost" size="sm">
                <Link href="/new-post">New post</Link>
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

              <span className="text-sm font-medium">
                Hello,{" "}
                <span className="hover:font-bold">
                  <Link href={`/${currentUser.username}`}>
                    {currentUser.username}
                  </Link>
                </span>
              </span>

              <Separator
                orientation="vertical"
                className="/bg-border mx-4 data-[orientation=vertical]:h-8"
              />

              <Button variant="ghost" size="sm" onClick={onLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>

              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
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
