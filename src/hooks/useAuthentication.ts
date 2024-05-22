import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthentication() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedToken = localStorage.getItem("token");
    if (storedUsername && storedToken) {
      setUsername(storedUsername);
      setToken(storedToken);
    } else {
      navigate("/login");
    }
  }, [username, navigate]);

  return { username, token };
}
