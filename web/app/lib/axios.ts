import axios from "axios";
import { getEnv } from "~/config/env";

export const api = axios.create({
  baseURL: getEnv("API_URL"),
});
