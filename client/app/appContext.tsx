'use client';

import { createContext, ReactNode, useEffect, useState, useContext, use } from "react";
import { User } from "./Type/User";
import { usePathname } from "next/navigation";
import { Post } from "./Type/Post";

export const AppContext = createContext<{
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  allPosts: Post[];
  setAllPosts: React.Dispatch<React.SetStateAction<Post[]>>;

} | null>(null);

export function ContextProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([] as Post[]);
  const ctx = { currentUser, setCurrentUser, allPosts, setAllPosts };
const pathname = usePathname();

  useEffect(() => {
    fetch('http://localhost:4000/all-posts', {
      credentials: 'include'
    })
    .then((res) => res.json())
    .then((data) => setAllPosts(data))
  }, [])

  useEffect(() => {
    fetch("http://localhost:4000/authen", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('haloo', data);

        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pathname]);

  return <AppContext value={ctx}>{children}</AppContext>;
}

export function useAppContext() {
  const ctx = use(AppContext);
  if (!ctx) throw new Error("AppContext.Provider is missing!");
  return ctx;
}