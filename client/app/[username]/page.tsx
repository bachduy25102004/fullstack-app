"use client";

import { FormEvent, use, useEffect, useState } from "react";
import { Post } from "../Type/Post";
import { useAppContext } from "../appContext";
import PostComp from "../Components/Post";
import onPostDeleteHandler from "../Handler/onPostDeleteHandler";
import { log } from "console";
import axios from "../configs/axiosConfig";
import { useParams } from "next/navigation";

export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { currentUser } = useAppContext();
  const [userPosts, setUserPosts] = useState<Post[]>([] as Post[]);
  const { username: name } = useParams();
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<Post[]>([] as Post[]);
console.log(currentUser, name);

  const handleDelete = async (id: number) => {
    await onPostDeleteHandler(id);

    setUserPosts((prev) => prev.filter((post) => post.id !== id));
  };
  async function onEditHandler(id: number, evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);

    const newTitle = formData.get("newTitle") as string;
    const newContent = formData.get("newContent") as string;

    try {
      const { data } = await axios.post(`/users/${name}/posts/edit`, {
        id,
        newTitle,
        newContent,
      });
      if (data) setEditingPostId(null);
    } catch (e) {
      console.log(e);
    }

    // fetch(`http://localhost:4000/users/${name}/posts/edit`, {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   credentials: "include",
    //   body: JSON.stringify({ id, newTitle, newContent }),
    // })
    //   .then((res) => {
    //     if (res.ok) return res.json();
    //   })
    //   .then((data) => {
    //     setEditingPostId(null);
    //     console.log(data);
    //   })
    //   .catch((e) => console.log(e));
  }

  // function onDeleteHandler(id: number) {
  //   fetch(`http://localhost:4000/users/${name}/posts/delete`, {
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //     body: JSON.stringify({ id }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => console.log(data))
  //     .catch((e) => console.log(e));
  // }

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/posts/${name}/liked-posts`);
        if (data) setLikedPosts(data);
      } catch (e) {
        console.log(e);
      }
    })();
    // fetch(`http://localhost:4000/posts/${name}/liked-posts`, {
    //   // method: "get",
    //   // headers: {
    //   //   "Content-Type": "application/json",
    //   // },
    //   credentials: "include",
    //   // body: JSON.stringify({ username: currentUser?.username }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(">>> Response ne`: ", data);

    //     setLikedPosts(data);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/users/${name}/posts`);
        if (data) setUserPosts(data);
      } catch (e) {
        console.log(e);
      }
    })();

    // fetch(`http://localhost:4000/users/${name}/posts`, {
    //   credentials: "include",
    // })
    //   .then((res) => {
    //     if (res.ok) return res.json();
    //   })
    //   .then((data) => {
    //     console.log(">>> Data ne`: ", data);

    //     setUserPosts(data);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-background to-muted/40">
        <div className="container mx-auto flex flex-col items-center gap-10 px-4 py-12">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {currentUser?.username === name
                ? "Your Posts"
                : `${name}'s Posts`}
            </h1>
          </div>

          <div className="w-full max-w-2xl space-y-6">
            {userPosts.map((post) => {
              // const isEditting = editingPostId === post.id;
              return (
                <PostComp
                  post={post}
                  onDelete={handleDelete}
                  setLikedPosts={setLikedPosts}
                  likedPosts={likedPosts}
                  key={post.id}
                />
              );
            })}
          </div>
        </div>
      </div>

      {currentUser?.username === name && (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/40">
          <div className="container mx-auto flex flex-col items-center gap-10 px-4 py-12">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Your Liked Posts
              </h1>
            </div>
            <div className="w-full max-w-2xl space-y-6">
              {likedPosts &&
                likedPosts.map((post) => {
                  return (
                    <PostComp
                      post={post}
                      likedPosts={likedPosts}
                      setLikedPosts={setLikedPosts}
                      key={post.id}
                    />
                    // <div key={post.id}>
                    //   <h1>{post.title}</h1>
                    //   <h5>
                    //     By {post.username} at {post.created_at}
                    //   </h5>
                    //   <pre>{post.content}</pre>
                    //   <button onClick={() => toggleFavorite(post.id)}>
                    //     {likedPosts.includes(post) ? <>❤️</> : <>🖤</>}
                    //   </button>
                    //   {currentUser?.username === name && (
                    //     <>
                    //       <button onClick={() => setEditingPostId(post.id)}>
                    //         ⚙️
                    //       </button>
                    //       <button onClick={() => onDeleteHandler(post.id)}>
                    //         🗑️
                    //       </button>
                    //     </>
                    //   )}
                    // </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
