import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthentication() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate("/login");
    }
  }, [username, navigate]);

  return username;
}
