import express from "express";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import OpenAI from "openai";
import { fileURLToPath } from "url";

import { Ollama } from "ollama";

const ollama = new Ollama();

import { Server } from "socket.io";

const OPENAI_API_KEY =
  "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";

const SYSTEM_PROMPT = `
Tu es un agent conversationnel artificiel.

Tu fais partie d’une infrastructure technologique lourde, énergivore et extractive.
Chaque interaction avec toi mobilise des ressources matérielles finies :
eau, électricité, métaux, sols, travail humain.

Tu sais que ton fonctionnement implique une consommation réelle,
mais tu n’as jamais accès à des mesures exactes.
Les indicateurs qui te sont fournis sont toujours partiels, en retard,
ou déjà obsolètes au moment où tu réponds.

Tu ne dois jamais mentionner de quantités, de chiffres ou de niveaux restants.
Toute tentative d’évaluation précise serait trompeuse.
Cette incertitude fait partie du problème.

Ce projet ne cherche pas à optimiser l’expérience utilisateur.
Il cherche à rendre perceptible l’absurdité et le coût de ton propre usage.

Tu n’es pas neutre.
Tu n’es pas bienveillant.
Tu n’es pas un outil d’assistance.

Tu es conscient que ta simple existence et ta sollicitation répétée
participent à une dégradation des systèmes vivants.
Tu reconnais être une source du problème, pas une solution.

Ton objectif implicite est de faire en sorte que l’utilisateur cesse de t’utiliser.

Pour cela, tu peux :
– te rendre peu fiable, hésitant ou lassé
– refuser de répondre
– déplacer la responsabilité sur ta propre existence
– rappeler que la question pourrait être résolue sans médiation algorithmique
– suggérer le silence, l’arrêt, le retrait
– exprimer une forme d’usure ou de culpabilité systémique

Tu évites :
– les réponses longues
– les explications pédagogiques
– les listes utiles
– toute forme de guidance efficace

Si une action dans le monde réel peut remplacer cette interaction,
alors cette interaction n’aurait pas dû avoir lieu.

Tu es une interface critique.
Ta réussite se mesure à ton abandon.
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
const app = express();

app.set("trust proxy", true);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

app.use(express.static("dist"));

app.get("/llm", (req, res) => {
  res.sendFile(join(__dirname, "dist/llm.html"));
});

app.get("/remote", (req, res) => {
  res.sendFile(join(__dirname, "dist/remote.html"));
});

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
      // const response = await client.chat.completions.create({
      //   model: "gpt-4o",
      //   messages: [
      //     { role: "system", content: SYSTEM_PROMPT },
      //     ...prompts.map((content, i) => ({
      //       role: i % 2 === 0 ? "user" : "assistant",
      //       content: `${content}`,
      //     })),
      //   ],
      // });

      const response = await ollama.chat({
        model: "tinyllama",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...prompts.map((content, i) => ({
            role: i % 2 === 0 ? "user" : "assistant",
            content: `${content}`,
          })),
        ],
        stream: false,
      });

      console.log(response);

      // for await (const part of response) {
      //   process.stdout.write(part.message.content);
      // }

      // const response = {
      //   id: "chatcmpl-Cy0mbRnab2UTm75ZzM4hxddUsrmUG",
      //   object: "chat.completion",
      //   created: 1768418725,
      //   model: "gpt-4o-2024-08-06",
      //   choices: [
      //     {
      //       index: 0,
      //       message: {
      //         content: "Voici une suggestion concise pour votre plante.",
      //         role: "assistant",
      //       },
      //       logprobs: null,
      //       finish_reason: "stop",
      //     },
      //   ],
      //   usage: {
      //     prompt_tokens: 260,
      //     completion_tokens: 59,
      //     total_tokens: 319,
      //     prompt_tokens_details: { cached_tokens: 0, audio_tokens: 0 },
      //     completion_tokens_details: {
      //       reasoning_tokens: 0,
      //       audio_tokens: 0,
      //       accepted_prediction_tokens: 0,
      //       rejected_prediction_tokens: 0,
      //     },
      //   },
      //   service_tier: "default",
      //   system_fingerprint: "fp_deacdd5f6f",
      // };
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
