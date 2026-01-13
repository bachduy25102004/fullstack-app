"use client";

import { useEffect, useState } from "react";
import { Post } from "./Type/Post";
import Link from "next/link";
import PostComp from "./Components/Post";
import { useAppContext } from "./appContext";
import axios from "./configs/axiosConfig";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const [queryClient] = useState(() => new QueryClient());

export default function HompePageContainer() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>
  );
}

export function HomePage() {
  const { currentUser } = useAppContext();
  // const [posts, setPosts] = useState<Post[]>([] as Post[]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([] as Post[]);
  const isLoggedIn = !!currentUser;
  const {
    isPending,
    isError,
    data: posts = [],
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchAllPosts,
  });

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        try {
          const { data } = await axios.get(
            `/posts/${currentUser.username}/liked-posts`
          );
          if (data) setLikedPosts(data);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [currentUser]);

  async function fetchAllPosts(): Promise<Post[]> {
    const { data } = await axios.get("/newsfeed");
    console.log('>>>', data);
    
    return data;
  }

  // useEffect(() => {
  //   fetchAllPosts();

  // fetch("http://localhost:4000/newsfeed", {
  //   credentials: "include",
  // })
  //   .then((res) => {
  //     // console.log('Res: ', res.json());

  //     return res.json();
  //   })
  //   .then((data) => {
  //     setPosts(data);
  //     console.log("Posts", data);
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });
  // }, []);
  if (isPending) {
    return <p>Loading posts...</p>;
  }

  if (isError) {
    return <p>Failed to load posts.</p>;
  }

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-background to-muted/40">
        <div className="container mx-auto flex flex-col items-center gap-10 px-4 py-12">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Latest Posts</h1>
            <p className="text-muted-foreground">
              See what people are sharing today
            </p>
          </div>

          <div className="w-full max-w-2xl space-y-6">
            {posts.map((post) => {
              if (isLoggedIn) {
                return (
                  <PostComp
                    key={post.id}
                    post={post}
                    likedPosts={likedPosts}
                    setLikedPosts={setLikedPosts}
                  />
                );
              }
              return <PostComp key={post.id} post={post} />;
            })}
          </div>
        </div>
      </div>

      {/* <h1>News Feed</h1>
      <div className="container mx-auto flex flex-col items-center gap-6">
        {posts.map((post) => {
          if (isLoggedIn) {
            return (
              <PostComp key={post.id} post={post} likedPosts={likedPosts} setLikedPosts={setLikedPosts}/>
             
            );
          } return (
            <PostComp key={post.id} post={post}/>
          )
        })}
      </div> */}
    </>
  );
}
