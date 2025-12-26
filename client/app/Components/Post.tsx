import { useState } from "react";
import onPostEditHandler from "../Handler/onPostEditHandler";
import { useAppContext } from "../appContext";
import { Post, Post as PostType } from "../Type/Post";
import onPostDeleteHandler from "../Handler/onPostDeleteHandler";
import toggleFavoritePost from "../Handler/toggleFavoritePost";

type Props = {
  post: PostType;
  onDelete?: (id: number) => void;
};

export default function PostComp({ post, onDelete }: Props) {
  const { currentUser, allPosts } = useAppContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [postData, setPostData] = useState<PostType>(post);
  const [error, setError] = useState<string | null>(null);
  

  function toggleFavorite(id: number) { 
      console.log('function worked!!!!');
      
      const isLiked = likedPosts.some(post => post.id === id);
  
      setLikedPosts((prev) => {
        if (isLiked) {       
          return prev.filter((post) => post.id !== id);
        } else {       
          return [...prev, allPosts.find((post) => post.id === id)!];
        }
      });
  
      fetch(`http://localhost:4000/posts/${id}/like`, {
            method: isLiked ? "delete" : "post",
            credentials: "include",
          })
            .then((res) => {
              if (res.ok) console.log("Unliked successfully");
            })
            .catch((e) => console.log(e));
    }

  return (
    <>
      {isEditing ? (
        <>
          <form onSubmit={async (e) => {
              try {
                const newPostData = await onPostEditHandler(post, e);
                setPostData(newPostData); 
                setIsEditing(false);     
                setError(null);
              } catch (err) {
                setError("Failed to update post");
              }
            }}>
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
          <button onClick={() => setIsEditing(false)}>❌</button>
        </>
      ) : (
        <div>
          <h1>{postData.title}</h1>
          <h5>
            By {postData.username} at {postData.created_at}
          </h5>
          <pre>{postData.content}</pre>
          <button onClick={() => toggleFavoritePost(post.id)}>
            {post.isLiked ? <>❤️</> : <>🖤</>}
          </button>
          {currentUser?.username === post.username && onDelete && (
            <>
              <button onClick={(e) => setIsEditing(true)}>⚙️</button>
              <button onClick={() => onDelete(post.id)}>🗑️</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
