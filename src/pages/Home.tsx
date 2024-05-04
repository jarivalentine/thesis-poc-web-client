import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import Header from "../components/Header";
import WorkspaceService from "../services/WorkspaceService";

export default function Login() {
  const username = useAuthentication();
  const [newWorkspace, setNewWorkspace] = useState("");
  const [workspaces, setWorkspaces] = useState<{ name: string }[]>([]);

  useEffect(() => {
    if (username) {
      const eventSource = new EventSource(
        "http://localhost:3000/sse?username=" + username
      );

      eventSource.addEventListener(`invite:${username}`, (event) => {
        setWorkspaces((workspaces) => [
          ...workspaces,
          { name: JSON.parse(event.data).workspace },
        ]);
      });
    }
  }, [username]);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    const response = await WorkspaceService.getAll();
    const data = await response.json();
    if (response.ok) {
      setWorkspaces(data);
    } else {
      console.error(data.error);
    }
  };

  const handleSubmitWorkspace = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const response = await WorkspaceService.create(newWorkspace);
    if (response.ok) {
      setNewWorkspace("");
      await fetchWorkspaces();
    } else {
      const data = await response.json();
      console.error(data.error);
    }
  };

  return (
    <>
      <Header username={username} />
      <main>
        <h2 className="text-center text-3xl mb-8">My workspaces</h2>
        <form
          className="flex justify-center gap-4 mb-8"
          onSubmit={handleSubmitWorkspace}
        >
          <input
            className="bg-gray p-2 w-64 rounded-xl"
            type="text"
            placeholder="New workspace"
            value={newWorkspace}
            onChange={(event) => setNewWorkspace(event.target.value)}
          />
          <input
            className="bg-blue text-white p-2 w-32 rounded-xl cursor-pointer"
            type="submit"
            value="Add"
          />
        </form>
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
