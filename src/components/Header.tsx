import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({
  username,
  workspacename,
}: {
  readonly username: string;
  readonly workspacename?: string;
}) {
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
      <Link to="/" className="w-1/3">
        <h1 className="text-blue font-medium text-xl">Thesis POC</h1>
      </Link>
      {workspacename && (
        <h2 className="text-2xl w-1/3 text-center">{workspacename}</h2>
      )}
      <div className="w-1/3 flex justify-end">
        <button
          type="button"
          className="bg-blue w-10 h-10 leading-10 text-center text-white rounded-full cursor-pointer select-none"
          onClick={toggleSettings}
          id="avatar"
        >
          {username.charAt(0).toUpperCase()}
        </button>
      </div>
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
