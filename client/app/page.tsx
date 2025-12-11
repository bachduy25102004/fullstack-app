"use client";


import { error } from "console";
import { useEffect, useState } from "react";
import { Post } from "./Type/Post";



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
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <h1>{post.title}</h1>
            <h5>
              By {post.username} at {post.created_at}
            </h5>
            <pre>{post.content}</pre>
          </div>
        );
      })}
    </>
  );
}
