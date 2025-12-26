export default async function onPostDeleteHandler( id: number) {
    const res = await fetch(`http://localhost:4000/posts/users/${id}/delete`, {
        method: 'delete',
    //     headers: {
    //   "Content-Type": "application/json",
    // },
    credentials: "include",
    // body: JSON.stringify({ id }),
  });
    if (!res.ok) {
    throw new Error("Failed to delete post");
  }

  const deletedId = await res.json();
  return deletedId;
}