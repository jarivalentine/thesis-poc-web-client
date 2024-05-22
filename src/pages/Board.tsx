import { useNavigate, useParams } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import Header from "../components/Header";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import TaskService from "../services/TaskService";

type Task = {
  id: number;
  title: string;
  status: string;
};

export default function Board() {
  const navigate = useNavigate();
  const { username, token } = useAuthentication();
  const { name } = useParams();
  const [socket, setSocket] = useState<Socket>();
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      auth: { token },
      query: { workspace: name },
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [name, token]);

  useEffect(() => {
    async function fetchTasks() {
      const response = await TaskService.getAll(name as string);
      const data = await response.json();

      if (response.ok) {
        setTasks(data);
      } else if (response.status === 401) {
        navigate("/login");
      } else {
        console.error(data.error);
      }
    }

    fetchTasks();
  }, [name, navigate]);

  useEffect(() => {
    if (socket) {
      socket.on("taskCreated", (task) => {
        setTasks([...tasks, task]);
      });

      socket.on("taskUpdated", (task) => {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === task.id ? task : t))
        );
      });

      socket.on("taskError", (data) => {
        console.error(data.error);
      });

      socket.on("connect_error", (error) => {
        console.error(error);
      });
    }
  }, [socket, tasks]);

  const handleSubmitTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!socket) return;
    socket.emit("createTask", {
      title: newTask,
      status: "to do",
      workspace: name,
    });
    setNewTask("");
  };

  const updateTaskStatus = async (taskId: number, status: string) => {
    if (!socket) return;
    socket.emit("updateTask", {
      taskId,
      status,
      workspace: name,
    });
  };

  const handleDragStart = (event: React.DragEvent, taskId: number) => {
    event.dataTransfer.setData("taskId", taskId.toString());
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent, status: string) => {
    event.preventDefault();
    const droppedTaskId = parseInt(event.dataTransfer.getData("taskId"));
    updateTaskStatus(droppedTaskId, status);
  };

  return (
    <>
      <Header username={username} workspacename={name as string} />
      <Nav workspacename={name as string} />
      <main className="w-5/6 inline-block p-4">
        <h2 className="text-2xl mb-4">Board</h2>
        <form className="flex gap-4 mb-4" onSubmit={handleSubmitTask}>
          <input
            className="bg-gray p-2 w-64 rounded-xl"
            type="text"
            placeholder="New task"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
          />
          <input
            className="bg-blue text-white p-2 w-32 rounded-xl cursor-pointer"
            type="submit"
            value="Add"
          />
        </form>
        <div className="flex w-full gap-2">
          <section
            className="w-1/4 flex flex-col gap-2 bg-gray rounded-xl p-2"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, "to do")}
          >
            <h3 className="uppercase mb-2">To do</h3>
            {tasks
              .filter((task) => task.status === "to do")
              .map((task) => (
                <div
                  className="bg-white p-4 rounded-md cursor-grab active:cursor-grabbing"
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  {task.title}
                </div>
              ))}
          </section>
          <section
            className="w-1/4 flex flex-col gap-2 bg-gray rounded-xl p-2"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, "in progress")}
          >
            <h3 className="uppercase mb-2">In progress</h3>
            {tasks
              .filter((task) => task.status === "in progress")
              .map((task) => (
                <div
                  className="bg-white p-4 rounded-md cursor-grab active:cursor-grabbing"
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  {task.title}
                </div>
              ))}
          </section>
          <section
            className="w-1/4 flex flex-col gap-2 bg-gray rounded-xl p-2"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, "in review")}
          >
            <h3 className="uppercase mb-2">In review</h3>
            {tasks
              .filter((task) => task.status === "in review")
              .map((task) => (
                <div
                  className="bg-white p-4 rounded-md cursor-grab active:cursor-grabbing"
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  {task.title}
                </div>
              ))}
          </section>
          <section
            className="w-1/4 flex flex-col gap-2 bg-gray rounded-xl p-2"
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, "done")}
          >
            <h3 className="uppercase mb-2">Done</h3>
            {tasks
              .filter((task) => task.status === "done")
              .map((task) => (
                <div
                  className="bg-white p-4 rounded-md cursor-grab active:cursor-grabbing"
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  {task.title}
                </div>
              ))}
          </section>
        </div>
      </main>
    </>
  );
}
