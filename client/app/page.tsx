"use client";



import { useEffect, useState } from "react";
import { Post } from "./Type/Post";
import Link from "next/link";
import PostComp from "./Components/Post";
import PostHome from "./Components/PostHome";



export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([] as Post[]);

  useEffect(() => {
    fetch("http://localhost:4000/newsfeed", {
      credentials: "include",
    })
      .then((res) => {
        // console.log('Res: ', res.json());

        return res.json();
      })
      .then((data) => {
        setPosts(data);
        console.log("Posts", data);
      })
      .catch((e) => {
        console.log(e);
        
      });
  }, []);

  return (
    <>
      <h1>News Feed</h1>
      <div className="container mx-auto flex flex-col gap-4">
        {posts.map((post) => <PostHome key={post.id} post={post} />)}
      </div>
    </>
  );
}
