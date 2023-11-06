import { io } from "socket.io-client";
import axios from "axios";

export const api = axios.create({ baseURL: "http://localhost:4000" });

export const socket = io("http://localhost:4000", {
  transports: ["websocket"],
});
