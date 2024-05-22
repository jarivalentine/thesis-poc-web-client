import { useParams, useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import Nav from "../components/Nav";
import Header from "../components/Header";
import { useCallback, useEffect, useState } from "react";
import WorkspaceService from "../services/WorkspaceService";

export default function Workspace() {
  const navigate = useNavigate();
  const { username } = useAuthentication();
  const [inviteUsername, setInviteUsername] = useState("");
  const { name } = useParams();
  const [workspace, setWorkspace] = useState({ name: "", users: [] });

  const fetchWorkspace = useCallback(async () => {
    const response = await WorkspaceService.get(name as string);
    const data = await response.json();
    if (response.ok) {
      setWorkspace(data);
    } else if (response.status === 401) {
      navigate("/login");
    }
  }, [name, navigate]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await WorkspaceService.invite(
      name as string,
      inviteUsername
    );
    if (response.ok) {
      setInviteUsername("");
      alert("User invited");
      await fetchWorkspace();
    } else if (response.status === 401) {
      navigate("/login");
    } else {
      setInviteUsername("");
      const data = await response.json();
      alert(data.error);
    }
  };

  return (
    <>
      <Header username={username} workspacename={name as string} />
      <Nav workspacename={name as string} />
      <main className="w-5/6 inline-flex p-4 gap-8">
        <section className="w-64">
          <h3 className="text-xl text-center mb-4">Users</h3>
          <ul>
            {workspace.users.map((user: { name: string }) => (
              <li
                className="bg-gray p-4 text-center mb-4 rounded-lg"
                key={user.name}
              >
                {user.name}
              </li>
            ))}
          </ul>
        </section>
        <section className="w-64">
          <h3 className="text-xl text-center mb-4">Invite user</h3>
          <form className="flex flex-col gap-4" onSubmit={handleInvite}>
            <input
              className="bg-gray p-2 rounded-xl"
              type="text"
              placeholder="Username"
              value={inviteUsername}
              onChange={(event) => setInviteUsername(event.target.value)}
            />
            <input
              className="bg-blue text-white p-2 rounded-xl cursor-pointer"
              type="submit"
              value="Invite"
            />
          </form>
        </section>
      </main>
    </>
  );
}
