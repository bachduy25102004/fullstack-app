"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { toast } from "react-toastify";
import { Switch } from "@/components/ui/switch";
import { LogOut, Moon, Search, Sun } from "lucide-react";
import ThemeSwitch from "./ThemeSwitch";

export default function NavBar() {
  // const [loggedInUser, setLoggedInUser] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { currentUser, setCurrentUser, isDarkTheme, setIsDarkTheme } =
    useAppContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkTheme(true);
    }
  }, []);

  function toggleTheme() {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setOpen(true);

      
      router.replace("/");
    }
  }, [searchParams, router]);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  async function onLogout() {
    try {
      const res = await axios("/logout");
      if (res) {
        setCurrentUser(null);
        router.push("/");
        toast.success(
          <div>
            <p>Logout successfully!</p>
            <p>See you another time</p>
          </div>,
        );
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
      const { data } = await axios.post("/login", {
        username,
        pwd,
      });
      // console.log('===', res);

      if (data) {
        console.log(data);

        setCurrentUser(data);
        toast.success("Welcome back! 🎉");

        router.push("/");
      }
    } catch (e) {
      toast.error("Wrong username or password");
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
  if (!mounted) return null;
  return (
    <nav className="border-b bg-background sticky">
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
            <span className="text-[16px]">Home</span>
          </Link>

          {currentUser && (
            <>
              <Separator
                orientation="vertical"
                className="bg-border w-3 mx-4 data-[orientation=vertical]:h-12"
              />
              <Button asChild variant="ghost" size="sm">
                <Link href="/new-post">New post</Link>
              </Button>
            </>
          )}

          <Separator
            orientation="vertical"
            className="bg-border w-3 mx-4 data-[orientation=vertical]:h-12"
          />
          {/* <Button onClick={() => setIsDarkTheme((prev) => !prev)}>
            {isDarkTheme ? <p>Dark</p> : <p>Light</p>}
          </Button> */}
          {/* <div className="relative">
            <Switch
              checked={isDarkTheme}
              onCheckedChange={toggleTheme}
              size="default"
              className="
                w-20 h-8
                data-[state=checked]:bg-zinc-800
                data-[state=unchecked]:bg-yellow-400
              "
            />
            <div
              className={`absolute top-0 left-0 transition-all duration-300 ${isDarkTheme ? "translate-x-4" : "translate-x-0"}`}
            >
              {isDarkTheme ? (
                <Moon className="w-5 h-5 text-white" />
              ) : (
                <Sun className="w-5 h-5 text-black" />
              )}
            </div>
          </div> */}
          <ThemeSwitch checked={isDarkTheme} onChange={toggleTheme} />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="relative w-[30vw]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            <Input type="search" className="pl-9" placeholder="Search..." />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          {currentUser ? (
            <>
              {/* <Avatar className="h-8 w-8">
              <AvatarFallback>
                {currentUser.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar> */}

              <span className="text-[16px] font-medium">
                Hello,{" "}
                <span className="hover:underline">
                  <Link href={`/${currentUser.username}`}>
                    {currentUser.username}
                  </Link>
                </span>
                !
              </span>

              <Separator
                orientation="vertical"
                className="bg-border mx-4 data-[orientation=vertical]:h-12"
              />

              <Button asChild variant="ghost" size="sm" onClick={onLogout}>
                <Link href="/" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/signup">Sign up</Link>
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>Log in</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Welcome Back!</DialogTitle>
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
                      Login
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
