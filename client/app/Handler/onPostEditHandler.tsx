import { FormEvent } from "react";
import { Post } from "../Type/Post";
import axios from "../configs/axiosConfig";
export default async function onPostEditHandler(
  post: Post,
  evt: FormEvent<HTMLFormElement>
) {
  evt.preventDefault();

  const formData = new FormData(evt.currentTarget);

  const newTitle = formData.get("newTitle") as string;
  const newContent = formData.get("newContent") as string;
  //   console.log("title ", newTitle);

  try {
    const res = await axios.put(
      `/posts/users/${post.id}/edit`,
      {
        id: post.id,
        newTitle,
        newContent,
      }
    );
    if (!res) {
      throw new Error("Failed to update post");
    }
    return res.data;
  } catch (e) {
    console.log(e);
  }

  //   method: "put",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   credentials: "include",
  //   body: JSON.stringify({ id:post.id, newTitle, newContent }),
  // });
}
