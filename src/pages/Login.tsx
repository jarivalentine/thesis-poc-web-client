import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await UserService.login(username, password);
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("username", username);
      localStorage.setItem("token", data);
      navigate("/");
    } else {
      setUsername("");
      setPassword("");
      alert(data.error);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center gap-4 h-screen">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <form className="flex flex-col gap-4 w-64" onSubmit={handleLogin}>
        <input
          className="bg-gray p-2 rounded-xl"
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          className="bg-gray p-2 rounded-xl"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <input
          className="bg-blue text-white p-2 rounded-xl cursor-pointer"
          type="submit"
          value="Login"
        />
      </form>
      <p>
        Don't have an account?{" "}
        <Link to="/register" className="text-blue font-medium hover:underline">
          Sing up
        </Link>
      </p>
    </main>
  );
}
