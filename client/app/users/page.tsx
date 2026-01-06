"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "../Type/User";
import { useAppContext } from "../appContext";
import axios from "../configs/axiosConfig";

// type User = {
//   username: string
// };

export default function usersPage() {
  const [users, setUsers] = useState<User[]>([] as User[]);
  const [error, setError] = useState<boolean>(false);
  const { currentUser } = useAppContext();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/users");
        setUsers(data);
      } catch (e) {
        console.log(e);
      }
    })();

    // fetch("http://localhost:4000/users", {
    //   credentials: "include",
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);

    //     setUsers(data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setError(true);
    //   });
  }, []);

  return (
    <>
      <h1>List of Users</h1>
      {!currentUser ? (
        <p>
          Please <Link href="/login">log in</Link> to view users
        </p>
      ) : (
        <ol>
          {users.map((user) => (
            <li key={user.username}>{user.username}</li>
          ))}
        </ol>
      )}
    </>
  );
}
