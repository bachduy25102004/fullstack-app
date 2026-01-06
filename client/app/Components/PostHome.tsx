import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function Post(props) {
  const { post } = props;

  // TODO: check if logged in -> include username in PUT request
  console.log('> post:', post);

  const [liked, setLiked] = useState(post.isLiked);

  return (
    <div className='border p-4'>
      <h1>Title: {post.title}</h1>
      <p>by: {post.username}</p>
      <pre>{post.content}</pre>
      {/* <button>{post.isLiked ? }</button> */}
      <Button
        variant='ghost'
        size={'icon'}
        // onClick={() => toggleFavorite(post)}
        onClick={() => setLiked((prevLiked) => !prevLiked)}
      >
        <Heart
          className={`
                h-6 w-6
                transition-all duration-400 ease-out
                ${
                  liked
                    ? 'fill-red-500 stroke-black scale-150'
                    : 'fill-transparent stroke-black scale-150'
                }
              `}
        />
      </Button>
    </div>
  );
}
