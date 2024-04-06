import config from "../config";

export default class UserService {
  static async getAll(workspace: string) {
    const fullUrl = `${config.baseUrl}/workspace/${workspace}/board`;

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response;
  }
}
