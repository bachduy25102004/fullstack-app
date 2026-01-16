"use client";

import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useContext,
  use,
} from "react";
import { User } from "./Type/User";
import { usePathname } from "next/navigation";
import { Post } from "./Type/Post";
import axios from "./configs/axiosConfig";

export const AppContext = createContext<{
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  
  // allPosts: Post[];
  // setAllPosts: React.Dispatch<React.SetStateAction<Post[]>>;
} | null>(null);

export function ContextProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [openComment, setOpenComment] = useState(false);
  // const [allPosts, setAllPosts] = useState<Post[]>([] as Post[]);

  const ctx = { currentUser, setCurrentUser};
  const pathname = usePathname();

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const { data: postsData } = await axios.get("/all-posts");
  //       setAllPosts(postsData);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   })();

    // fetch("http://localhost:4000/all-posts", {
    //   credentials: "include",
    // })
    //   .then((res) => res.json())
    //   .then((data) => setAllPosts(data));
  // }, []);

  useEffect(() => {
     (async () => {
      try {
        const { data: currentUserData } = await axios.get("/authen");
        setCurrentUser(currentUserData);
      } catch (e) {
        console.log(e);
      }
    })();

    // fetch("http://localhost:4000/authen", {
    //   credentials: "include",
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log("haloo", data);

    //     setCurrentUser(data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, [pathname]);

  return <AppContext value={ctx}>{children}</AppContext>;
}

export function useAppContext() {
  const ctx = use(AppContext);
  if (!ctx) throw new Error("AppContext.Provider is missing!");
  return ctx;
}
