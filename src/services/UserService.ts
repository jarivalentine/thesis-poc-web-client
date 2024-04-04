import config from "../config";

export default class UserService {
  static async login(username: string, password: string) {
    const fullUrl = `${config.baseUrl}/login`;

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username, password }),
    });

    return response;
  }

  static async register(username: string, password: string) {
    const fullUrl = `${config.baseUrl}/register`;

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username, password }),
    });

    return response;
  }
}
