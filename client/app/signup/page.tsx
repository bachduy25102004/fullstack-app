export default function signupPage() {
  return (
    <form action="http://localhost:4000/signup" method="POST">
      <div>
        <label htmlFor="name">Username</label>
        <input type="text" name="name" />
      </div>
      <div>
        <label htmlFor="pwd">Password</label>
        <input type="password" name="pwd" />
      </div>
      <button>Signup</button>
    </form>
  );
}
