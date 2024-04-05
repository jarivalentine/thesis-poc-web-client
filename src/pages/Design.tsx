import { useParams } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import Header from "../components/Header";
import Nav from "../components/Nav";

export default function Design() {
  const username = useAuthentication();
  const { name } = useParams();

  return (
    <>
      <Header username={username} workspacename={name as string} />
      <Nav workspacename={name as string} />
      <main className="w-5/6 inline-block">
        <h2 className="text-center text-2xl mb-8">Design</h2>
      </main>
    </>
  );
}
