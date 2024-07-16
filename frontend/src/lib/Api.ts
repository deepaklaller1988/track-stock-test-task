import { handleError } from "../lib/errorHandler";

export interface Res {
  success: boolean;
  status: number;
  resent: boolean;
  resend: Function;
  [key: string]: any;
}

class API {
  static async get(
    path: string | string[],
    resent: boolean = false
  ): Promise<Res> {
    return new Promise(async (resolve, reject) => {
      if (Array.isArray(path)) path = path.join("/");

      let headers = new Headers();
      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + path, {
          method: "GET",
          credentials: "include",
          headers: headers,
        });

        const parsed = await this.parseRes(
          response,
          () => this.get(path, true),
          resent,
          path
        );

        resolve(parsed);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  static async post(
    path: string | string[],
    body: any,
    resent: boolean = false
  ): Promise<Res> {
    return new Promise(async (resolve, reject) => {
      if (Array.isArray(path)) path = path.join("/");

      let headers = new Headers();
      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + path, {
          method: "POST",
          credentials: "include",
          headers: headers,
          body: JSON.stringify(body),
        });

        const parsed = await this.parseRes(
          response,
          () => this.post(path, body, true),
          resent,
          path
        );

        if (!parsed.success) {
          reject(parsed);
        } else {
          resolve(parsed);
        }
      } catch (error: any) {
        reject(error);
        handleError(error.code);
      }
    });
  }

  static async parseRes(
    raw: Response,
    resend: Function,
    resent: boolean,
    path: string | string[]
  ): Promise<Res> {
    try {
      let res: Res = await raw.json();
      res.success = raw.status >= 200 && raw.status < 300;
      res.status = raw.status;
      res.resend = resend;
      res.resent = resent;

      if (!res.success) {
        handleError(res);
      }

      return res;
    } catch (error) {
      console.error("Error parsing response:", error);
      throw handleError(error); // Rethrow the error to propagate it
    }
  }
}

export default API;
