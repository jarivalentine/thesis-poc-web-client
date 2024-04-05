import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import Header from "../components/Header";
import WorkspaceService from "../services/WorkspaceService";

export default function Login() {
  const username = useAuthentication();
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    async function fetchWorkspaces() {
      const response = await WorkspaceService.getAll();
      const data = await response.json();
      if (response.ok) {
        setWorkspaces(data);
      } else {
        console.error(data.error);
      }
    }

    fetchWorkspaces();
  }, []);

  return (
    <>
      <Header username={username} />
      <main>
        <h2 className="text-center text-3xl mb-8">My workspaces</h2>
        <ul className="flex justify-center flex-wrap gap-4 w-4/5 mx-auto">
          {workspaces.map((workspace: { name: string }) => (
            <li key={workspace.name}>
              <Link
                className="block w-64 text-center text-white"
                to={`/${workspace.name}`}
              >
                <div className="h-20 bg-gray rounded-t-lg"></div>
                <p className="bg-blue py-2 rounded-b-lg">{workspace.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
