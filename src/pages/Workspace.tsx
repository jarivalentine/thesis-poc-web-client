import { useParams, useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import Nav from "../components/Nav";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import WorkspaceService from "../services/WorkspaceService";

export default function Workspace() {
  const navigate = useNavigate();
  const username = useAuthentication();
  const { name } = useParams();
  const [workspace, setWorkspace] = useState({ name: "", users: [] });

  useEffect(() => {
    async function fetchWorkspace() {
      const response = await WorkspaceService.get(name as string);
      const data = await response.json();
      if (response.ok) {
        setWorkspace(data);
      } else if (response.status === 401) {
        navigate("/login");
      }
    }

    fetchWorkspace();
  }, [name, navigate]);

  return (
    <>
      <Header username={username} workspacename={name as string} />
      <Nav workspacename={name as string} />
      <main className="w-5/6 inline-block">
        <h3>Users</h3>
        <ul>
          {workspace.users.map((user: { name: string }) => (
            <li key={user.name}>{user.name}</li>
          ))}
        </ul>
        <h3>Invite user</h3>
        <form>
          <input type="text" placeholder="Username" />
          <input type="submit" value="Invite" />
        </form>
      </main>
    </>
  );
}
