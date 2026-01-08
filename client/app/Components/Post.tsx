import { useEffect, useState } from "react";
import onPostEditHandler from "../Handler/onPostEditHandler";
import { useAppContext } from "../appContext";
import { Post, Post as PostType } from "../Type/Post";
import onPostDeleteHandler from "../Handler/onPostDeleteHandler";
import axios from "../configs/axiosConfig";
import { Button } from "@/components/ui/button";
import { Ghost, Heart, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

type Props = {
  post: PostType;
  onDelete?: (id: number) => void;
  likedPosts?: Post[];
  setLikedPosts?: React.Dispatch<React.SetStateAction<Post[]>>;
};

export default function PostComp({
  post,
  onDelete,
  likedPosts,
  setLikedPosts,
}: Props) {
  const { currentUser } = useAppContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [postData, setPostData] = useState<PostType>(post);
  const [error, setError] = useState<string | null>(null);
  // const [isLiked, setIsLiked] = useState<boolean>(post.isLiked);
  const isLiked = likedPosts?.some((lp) => lp.id === post.id);

  async function toggleFavorite(post: PostType) {
    try {
      let res;
      if (isLiked) {
        res = await axios.delete(`/posts/${post.id}/like`);
      } else {
        res = await axios.post(`/posts/${post.id}/like`);
      }
      if (res && setLikedPosts) {
        setLikedPosts((prev) => {
          if (isLiked) {
            // post.isLiked = false;
            // setIsLiked(false);
            return prev.filter((prePost) => prePost.id !== post.id);
          } else {
            // post.isLiked = true;
            return [...prev, post];
          }
        });
      }
    } catch (e) {
      console.log(e);
    }

    // fetch(`http://localhost:4000/posts/${post.id}/like`, {
    //   method: isLiked ? "delete" : "post",
    //   credentials: "include",
    // })
    //   .then((res) => {
    //     if (res.ok) console.log("Unliked/like successfully");

    //     setLikedPosts((prev) => {
    //       if (isLiked) {
    //         // post.isLiked = false;
    //         // setIsLiked(false);
    //         return prev.filter((prePost) => prePost.id !== post.id);
    //       } else {
    //         // post.isLiked = true;
    //         return [...prev, post];
    //       }
    //     });
    //   })
    //   .catch((e) => console.log(e));

    // (async () => {
    //   try {
    //     const method = isLiked ? "DELETE" : "POST";
    //     const res = await fetch(`http://localhost:4000/posts/${post.id}/like`, {
    //       method,
    //       credentials: "include",
    //     });
    //     if (!res.ok) {
    //       console.log("Failed to toggle like");
    //       return;
    //     }

    //     setIsLiked((prev) => {
    //       const newLiked = !prev;
    //       setLikedPosts((prevArr) => {
    //         if (newLiked) {
    //           return [...prevArr, { ...post, isLiked: true }];
    //         }
    //         return prevArr.filter((p) => p.id !== post.id);
    //       });
    //       return newLiked;
    //     });
    //   } catch (e) {
    //     console.log(e);
    //   }
    // })();
  }

  // useEffect(() => {
  //   // console.log('likedPosts', likedPosts);

  //   if (likedPosts.some(lp => lp.id === post.id)) setIsLiked(true);
  //   else setIsLiked(false);
  // }, [likedPosts]);

  return (
    <>
      {isEditing ? (
        <>
          <form
            onSubmit={async (e) => {
              try {
                const newPostData = await onPostEditHandler(post, e);
                setPostData(newPostData);
                setIsEditing(false);
                setError(null);
              } catch (err) {
                setError("Failed to update post");
              }
            }}
          >
            <div>
              <input
                type="text"
                placeholder="Title..."
                name="newTitle"
                defaultValue={post.title}
              />
            </div>
            <div>
              <textarea
                placeholder="Content..."
                name="newContent"
                rows={10}
                cols={40}
                defaultValue={post.content}
              />
            </div>

            <button>✔️</button>
          </form>
          <Button onClick={() => setIsEditing(false)}>❌</Button>
        </>
      ) : (
        <Card className="rounded-2xl shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-2">
              <h2 className="text-[30px] font-semibold leading-none">
                {post.title}
              </h2>

              <p className="text-xs text-muted-foreground">
                by{" "}
                <Link
                  href={`/${post.username}`}
                  className="font-bold text-[16px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {post.username}
                </Link>{" "}
                at {post.created_at}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={!currentUser}
                onClick={() => toggleFavorite(post)}
                className="group"
              >
                <Heart
                  className={`
                  h-5 w-5 
                  transition-transform 
                  duration-500 ease-out 
                  group-hover:scale-110
                  active:scale-95 ${
                    isLiked
                      ? "fill-red-500 text-red-500 scale-110"
                      : "text-muted-foreground group-hover:text-red-500"
                  }`}
                />
              </Button>
              {currentUser?.username === post.username && onDelete && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(post.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <p className="text-sm leading-relaxed text-foreground/90">
              {post.content}
            </p>
          </CardContent>
        </Card>

        // <div>
        //   <h1>{postData.title}</h1>
        //   <h5>
        //     By {postData.username} at {postData.created_at}
        //   </h5>
        //   <pre>{postData.content}</pre>
        //   <Button
        //     variant='ghost'
        //     size={"icon"}
        //     onClick={() => toggleFavorite(post)}
        //   >
        //     <Heart
        //       className={`
        //         h-6 w-6
        //         transition-all duration-400 ease-out
        //         ${
        //           isLiked
        //             ? "fill-red-500 stroke-black scale-150"
        //             : "fill-transparent stroke-black scale-150"
        //         }
        //       `}
        //     />
        //   </Button>

        // </div>
      )}
    </>
  );
}
