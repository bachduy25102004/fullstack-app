"use client";

import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../appContext";
import { log } from "console";

export default function newPostsPage() {
  // const [loggedInUser, setLoggedInUser] = useState(null);
  const { currentUser } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  // useEffect(() => {
  //   fetch("http://localhost:4000/authen", {
  //     credentials: "include", // Include cookies in the request
  //   })
  //     .then((res) => {
  //       console.log("nav res:", res);
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log("nav data:", data);
  //       setLoggedInUser(data);

  //       // Protected route: user must be loggedin to create a new post
  //       if (!data) return router.push("/");
  //     });
  // }, [pathname]);

  const uploadHandler = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    console.log(title, content);

    fetch("http://localhost:4000/posts/new", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ title, content }),
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        console.log(">>>>>>Post id:", data.post_id);
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {currentUser ? (
        <>
          <h1>New post</h1>

          <form onSubmit={uploadHandler}>
            <div>
              <input type="text" placeholder="Title..." name="title" />
            </div>
            <div>
              <textarea
                placeholder="Content..."
                name="content"
                rows={10}
                cols={40}
              />
            </div>

            <button>Create post</button>
          </form>
        </>
      ) : (
        <p>Log in to use this feature</p>
      )}
    </div>
  );
}
