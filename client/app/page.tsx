"use client";



import { useEffect, useState } from "react";
import { Post } from "./Type/Post";
import Link from "next/link";
import PostComp from "./Components/Post";



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
          <PostComp key={post.id} post={post} likedPosts={[]} setLikedPosts={()=>{}}/>

          // <div key={post.id}>
          //   <h1>{post.title}</h1>
          //   <h5>
          //     By <Link href={ `/${post.username}`}>{post.username}</Link> at {post.created_at}
          //   </h5>
          //   <pre>{post.content}</pre>
          // </div>
        );
      })}
    </>
  );
}
