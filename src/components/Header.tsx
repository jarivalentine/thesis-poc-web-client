import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  readonly username: string;
};

export default function Header({ username }: HeaderProps) {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#avatar") && !target.closest("#logout")) {
        setShowSettings(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center p-4 h-10 box-content relative">
      <h1 className="text-blue font-medium">Thesis POC</h1>
      <button
        type="button"
        className="bg-blue w-10 h-10 leading-10 text-center text-white rounded-full cursor-pointer select-none"
        onClick={toggleSettings}
        id="avatar"
      >
        {username.charAt(0).toUpperCase()}
      </button>
      {showSettings && (
        <button
          className="bg-gray p-4 w-40 rounded-xl absolute right-4 top-16"
          onClick={handleLogout}
          id="logout"
        >
          Logout
        </button>
      )}
    </header>
  );
}
