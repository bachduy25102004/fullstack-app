import { FormEvent } from "react";
import { Post } from "../Type/Post";

export default async function onPostEditHandler(
  post: Post,
  evt: FormEvent<HTMLFormElement>
) {
  evt.preventDefault();

  const formData = new FormData(evt.currentTarget);

  const newTitle = formData.get("newTitle") as string;
  const newContent = formData.get("newContent") as string;
  //   console.log("title ", newTitle);

  const res = await fetch(`http://localhost:4000/posts/users/${post.id}/edit`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id:post.id, newTitle, newContent }),
  });
  if (!res.ok) {
    throw new Error("Failed to update post");
  }

  return res.json();
}
