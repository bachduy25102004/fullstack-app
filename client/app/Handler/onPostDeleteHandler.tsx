import axios from "../configs/axiosConfig";

export default async function onPostDeleteHandler(id: number) {
  try {
    const res = await axios.delete(
      `/posts/users/${id}/delete`
    );
    if (!res) {
      throw new Error("Failed to delete post");
    }

    const deletedId = await res.data;
    return deletedId;

  } catch (e) {
    console.log(e);
  }

  // , {
  //     method: 'delete',
  //     headers: {
  //   "Content-Type": "application/json",
  // },
  // credentials: "include",
  // body: JSON.stringify({ id }),
  // });
}
