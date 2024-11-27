import axios from "axios";

declare global {
  interface Window {
    env: { API_URL: string };
  }
}

export const api = axios.create({
  baseURL:
    typeof process !== "undefined" ? process.env.API_URL : window.env.API_URL,
});
