import { useEffect, useState } from "react";
import config from "../config";

export const useMercure = (endpoint: string) => {
  const [data, setData] = useState([
    "welcome to your new workspace",
    "start by inviting your team members",
  ]);

  useEffect(() => {
    const fullUrl = config.mercureUrl + endpoint;

    const eventSource = new EventSource(fullUrl);

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
    };

    eventSource.onerror = (error) => {
      console.error("Failed to connect to Mercure:", error);
    };

    return () => {
      eventSource.close();
    };
  }, [endpoint]);

  return data;
};
