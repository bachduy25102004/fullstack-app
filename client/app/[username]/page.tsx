'use client';

import { use, useEffect, useState } from "react";
import { Post } from "../Type/Post";

export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const [userPosts, setUserPosts] = useState<Post[]>([] as Post[]);
  const { username } = use(params);

  useEffect(() => {
    fetch(`http://localhost:4000/users/${username}/posts`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUserPosts(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <>
      <h1>{username}'s Posts</h1>
      {userPosts.map((post) => {
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
