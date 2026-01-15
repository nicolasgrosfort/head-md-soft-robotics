// socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.DEV ? "http://localhost:3000" : undefined);

socket.on("connect", () => {
  console.log("Socket.IO connecté :", socket.id);
});

export default socket;
