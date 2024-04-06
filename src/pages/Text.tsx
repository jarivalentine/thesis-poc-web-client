import { useParams } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import Header from "../components/Header";
import Nav from "../components/Nav";

export default function Text() {
  const username = useAuthentication();
  const { name } = useParams();

  return (
    <>
      <Header username={username} workspacename={name as string} />
      <Nav workspacename={name as string} />
      <main className="w-5/6 inline-block p-4">
        <h2 className="text-2xl mb-8">Text</h2>
      </main>
    </>
  );
}
