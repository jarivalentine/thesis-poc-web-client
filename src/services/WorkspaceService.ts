import config from "../config";

export default class UserService {
  static async getAll() {
    const fullUrl = `${config.baseUrl}/workspace`;

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response;
  }

  static async get(name: string) {
    const fullUrl = `${config.baseUrl}/workspace/${name}`;

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response;
  }

  static async create(name: string) {
    const fullUrl = `${config.baseUrl}/register`;

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name }),
    });

    return response;
  }

  static async invite(name: string, username: string) {
    const fullUrl = `${config.baseUrl}/workspace/${name}/invite`;

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ username }),
    });

    return response;
  }
}
