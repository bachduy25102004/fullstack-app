'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppContext } from '../appContext';



export default function NavBar() {
  // const [loggedInUser, setLoggedInUser] = useState(null);
  
  const { currentUser } = useAppContext();
   useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  // useEffect(() => {
  //   fetch('http://localhost:4000/authen', {
  //     credentials: 'include', 
  //   })
  //     .then((res) => {
       
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log('nav data:', data);
  //       setLoggedInUser(data);
  //     });
  // }, [pathname]);

  return (
    <nav style={{ display: 'flex', 'flexDirection': 'row', 'justifyContent': 'space-between'}}>
      <div>
        <Link href='/'>Home</Link>
        <Link href='/users'>Users</Link>
        {currentUser && <Link href='/new-post'>New post</Link>}
      </div>

      {currentUser ? (
        <div>
          Hello, {currentUser.username}!
        </div>
      ) : (
        <div style={{margin: '15px'}}>
          <Link href='/login'>Login</Link>
          <Link href='/signup'>Sign up</Link>
        </div>
      )}
    </nav>
  );
}