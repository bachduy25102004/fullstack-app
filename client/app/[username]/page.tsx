'use client';

import { FormEvent, use, useEffect, useState } from 'react';
import { Post } from '../Type/Post';
import { useAppContext } from '../appContext';
import PostComp from '../Components/Post';
import onPostDeleteHandler from '../Handler/onPostDeleteHandler';

export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { currentUser } = useAppContext();
  const [userPosts, setUserPosts] = useState<Post[]>([] as Post[]);
  const { username: name } = use(params);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const [likedPosts, setLikedPosts] = useState<Post[] | null>(null);

  const handleDelete = async (id: number) => {
    await onPostDeleteHandler(id);

    setUserPosts((prev) => prev.filter((post) => post.id !== id));
  };

  function onEditHandler(id: number, evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);

    const newTitle = formData.get('newTitle') as string;
    const newContent = formData.get('newContent') as string;

    fetch(`http://localhost:4000/users/${name}/posts/edit`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ id, newTitle, newContent }),
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        setEditingPostId(null);
        console.log(data);
      })
      .catch((e) => console.log(e));
  }

  function onDeleteHandler(id: number) {
    fetch(`http://localhost:4000/users/${name}/posts/delete`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    fetch(`http://localhost:4000/users/${name}/posts`, {
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        setUserPosts(data);
      })
      .catch((e) => {
        console.log(e);
      });

    (async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/posts/${name}/liked`,
          {
            credentials: 'include',
          }
        );

        const data = await res.json();
        console.log('> likedPosts', data);

        setLikedPosts(data);
      } catch (err) {
        //
      }
    })();
  }, []);

  return (
    <>
      <h1>{name}'s Posts</h1>
      {userPosts.map((post) => {
        // const isEditting = editingPostId === post.id;
        return <PostComp post={post} onDelete={handleDelete} key={post.id} />;
      })}

      {currentUser?.username === name && (
        <div>
          <h1>Your Liked Posts</h1>

          <div>
            {likedPosts && likedPosts.map((post) => {
                return <PostComp post={post} key={post.id} setLikedPosts={setLikedPosts} />;
              })}
          </div>
        </div>
      )}
    </>
  );
}

// {
//   likedPosts &&
//     likedPosts.map((post) => {
//       return (
//         <PostComp post={post} key={post.id} />
//         // <div key={post.id}>
//         //   <h1>{post.title}</h1>
//         //   <h5>
//         //     By {post.username} at {post.created_at}
//         //   </h5>
//         //   <pre>{post.content}</pre>
//         //   <button onClick={() => toggleFavorite(post.id)}>
//         //     {likedPosts.includes(post) ? <>❤️</> : <>🖤</>}
//         //   </button>
//         //   {currentUser?.username === name && (
//         //     <>
//         //       <button onClick={() => setEditingPostId(post.id)}>
//         //         ⚙️
//         //       </button>
//         //       <button onClick={() => onDeleteHandler(post.id)}>
//         //         🗑️
//         //       </button>
//         //     </>
//         //   )}
//         // </div>
//       );
//     });
// }
