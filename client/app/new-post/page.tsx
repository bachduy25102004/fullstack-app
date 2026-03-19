"use client";

import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../appContext";
import { log } from "console";
import axios from "../configs/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

    (async () => {
      try {
        const { data } = await axios.post("/posts/new", {
          title,
          content,
        });
        if (data) {
          router.push("/");
        }
      } catch (e) {
        console.log(e);
      }
    })();

    // fetch("http://localhost:4000/posts/new", {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   credentials: "include",
    //   body: JSON.stringify({ title, content }),
    // })
    //   .then((res) => {
    //     if (res.ok) return res.json();
    //   })
    //   .then((data) => {
    //     console.log(">>>>>>Post id:", data.post_id);
    //     router.push("/");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  return (
    // <div>
    //   {currentUser ? (
    //     <>
    //       <h1>New post</h1>

    //       <form onSubmit={uploadHandler}>
    //         <div>
    //           <input type="text" placeholder="Title..." name="title" />
    //         </div>
    //         <div>
    //           <textarea
    //             placeholder="Content..."
    //             name="content"
    //             rows={10}
    //             cols={40}
    //           />
    //         </div>

    //         <button>Create post</button>
    //       </form>
    //     </>
    //   ) : (
    //     <p>Log in to use this feature</p>
    //   )}
    // </div>
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      {currentUser ? (
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Post</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={uploadHandler} className="space-y-6">
              
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  type="text"
                  placeholder="Enter your title..."
                  name="title"
                  className="text-base"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Write your post..."
                  name="content"
                  rows={8}
                  
                  className="resize-none text-base leading-relaxed h-40"
                />
              </div>

              {/* Button */}
              <div className="flex justify-end">
                <Button type="submit" className="px-6">
                  Create Post
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground text-lg">
          Log in to use this feature
        </p>
      )}
    </div>
  );
}
