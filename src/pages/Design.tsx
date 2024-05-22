import { useParams } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import Header from "../components/Header";
import Nav from "../components/Nav";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import cursorSvg from "../assets/img/svg/cursor.svg";

export default function Design() {
  const { username } = useAuthentication();
  const { name } = useParams();
  const [socket, setSocket] = useState<Socket>();
  const [userPositions, setUserPositions] = useState<{
    [username: string]: { x: number; y: number };
  }>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io("http://localhost:3000", {
      auth: { token },
      query: { workspace: name, type: "design" },
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [name]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parentWidth =
      (canvas.parentElement?.clientWidth ?? canvas.height) - 32;

    canvas.width = parentWidth;
    canvas.height = parentWidth * 0.5;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.imageSmoothingEnabled = true;

    Object.entries(userPositions).forEach(([positionUsername, position]) => {
      if (positionUsername === username) return;
      const iconSize = 32;
      const iconX = position.x - iconSize / 2;
      const iconY = position.y - iconSize / 2;
      const image = new Image();
      image.src = cursorSvg;
      context.drawImage(image, iconX, iconY, iconSize, iconSize);
    });
  }, [userPositions, username]);

  useEffect(() => {
    if (socket) {
      socket.on("mousePosition", (userPosition) => {
        setUserPositions((prevPositions) => {
          return {
            ...prevPositions,
            [userPosition.username]: userPosition.position,
          };
        });
      });

      socket.on("cursorError", (data) => {
        console.error(data.error);
      });

      socket.on("connect_error", (error) => {
        console.error(error);
      });
    }
  }, [socket]);

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const handleMouseEnter = (event: MouseEvent) => {
      if (!socket || !canvasRef.current) return;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;

      const userPosition = {
        username,
        position: {
          x: mouseX,
          y: mouseY,
        },
        room: `${name}-design`,
      };
      socket.emit("mousePosition", userPosition);
    };

    canvas.addEventListener("mousemove", handleMouseEnter);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseEnter);
    };
  }, [socket, username, name]);

  return (
    <>
      <Header username={username} workspacename={name as string} />
      <Nav workspacename={name as string} />
      <main className="w-5/6 inline-block p-4">
        <h2 className="text-2xl mb-4">Design</h2>
        <canvas className="bg-gray rounded-xl" ref={canvasRef}></canvas>
      </main>
    </>
  );
}
