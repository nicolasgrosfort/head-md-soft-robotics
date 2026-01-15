import express from "express";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { Ollama } from "ollama";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { SYSTEM_PROMPT } from "./config.js";

const ollama = new Ollama();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// Server

app.use(express.static("dist"));

app.get("/llm", (req, res) => {
  res.sendFile(join(__dirname, "dist/llm.html"));
});

app.get("/remote", (req, res) => {
  res.sendFile(join(__dirname, "dist/remote.html"));
});

// Socket

io.on("connection", (socket) => {
  console.log("Client connecté :", socket.id);

  socket.on("next-angle", (data) => {
    console.log("Changement de l'angle de l'eau :", data);
    io.emit("next-angle", data);
  });

  socket.on("current-angle", (state) => {
    io.emit("current-angle", state);
  });

  socket.on("current-soil", (data) => {
    io.emit("current-soil", data);
  });

  socket.on("llm-prompt", async ({ prompts, waterReserve }) => {
    console.log("Prompt reçu :", { prompts, waterReserve });

    try {
      const response = await ollama.chat({
        model: "gemma3:1b",
        options: {},
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...prompts.map((content, i) => ({
            role: i % 2 === 0 ? "user" : "assistant",
            content: `${content}`,
          })),
        ],
      });

      console.log(response);
      io.emit("llm-response", response);
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API OpenAI :", error);
    }
  });

  socket.on("open-for", ({ angle, duration }) => {
    console.log(`Ouvrir à ${angle} pour ${duration}  millisecondes`);
    io.emit("open-for", { angle, duration });
  });

  socket.on("open", () => {
    console.log("Ouvrir l'eau");
    io.emit("open");
  });

  socket.on("close", () => {
    console.log("Fermer l'eau");
    io.emit("close");
  });

  socket.on("current-light", (state) => {
    io.emit("current-light", state);
  });

  socket.on("next-light", (data) => {
    console.log("Changement de l'état de la lumière :", data);
    io.emit("next-light", data);
  });

  socket.on("connected", (status) => {
    io.emit("connected", status);
  });

  socket.on("disconnect", () => {
    console.log("Client déconnecté :", socket.id);
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("🚀 prod server ready");
});
