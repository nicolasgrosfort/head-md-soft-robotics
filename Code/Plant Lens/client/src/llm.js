import socket from "./socket";

const LITER_PER_TOKENS = 0.03; // liters per token
const WATER_RESERVE = 24; // 24 liters

const input = document.querySelector("#input");
const totalWaterCost = document.querySelector("#total-water-cost");
const sendButton = document.querySelector("#send");
const endMessage = document.querySelector("#end-message");
const main = document.querySelector("#main");
const water = document.querySelector("#water");
const promptCount = document.querySelector("#prompt-count");
const restartButton = document.querySelector("#restart");
const waterCount = document.querySelector("#water-count");
const tokensCount = document.querySelector("#tokens-count");

const waterConsomption = [];
const inputHistory = [
  "Quelle journée magnifiquement ensoleillée ☀️, n'est-ce pas ? <br />Que puis-je faire <s>à ta place</s> pour toi ?",
];

let waterReserve = WATER_RESERVE;
let currentAngle = 120;
let totalTokens = 0;

socket.on("current-angle", (angleValue) => {
  currentAngle = angleValue;
  console.log(`Angle command received from server: ${currentAngle}\n`);
});

socket.on("llm-response", async (response) => {
  //   await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate thinking time
  enableCommands();
  // --- LLM response ---
  const textResponse = response.message.content;
  console.log("Response from LLM:", textResponse);
  inputHistory.push(textResponse);

  const outputTokens = response.eval_count;
  totalTokens += outputTokens;
  waterConsomption.push(tokenToLiters(outputTokens));
  waterReserve -= tokenToLiters(outputTokens);

  if (waterReserve <= 0) {
    waterReserve = 0;
    water.style.height = `0%`;
    sendButton.disabled = true;
    input.disabled = true;
    endMessage.style.display = "flex";

    promptCount.textContent = `${(inputHistory.length - 1) / 2}`;
    waterCount.textContent = `${WATER_RESERVE}`;
    tokensCount.textContent = `${totalTokens}`;
  }

  // --- UI updates ---
  totalWaterCost.textContent = `${waterReserve.toFixed(2)}`;
  water.style.height = `${getPercent(waterReserve, WATER_RESERVE)}%`;
  main.innerHTML = inputHistory
    .map((text, i) =>
      i % 2 === 0
        ? `<p class="ai"><span>ROBOT</span>${text}</p>`
        : `<p class="user"><span>HUMAIN</span>${text}</p>`
    )
    .join("\n");

  main.scrollTop = main.scrollHeight;
});

sendButton.onclick = () => {
  const prompt = input.value;
  if (!prompt.trim()) return;

  inputHistory.push(prompt);

  const inputTokens = countTokens(prompt);
  waterConsomption.push(tokenToLiters(inputTokens));

  const duration = tokenToTime(inputTokens);
  //   socket.emit("open-for", {
  //     angle: 30,
  //     duration,
  //   });

  socket.emit("llm-prompt", { prompts: inputHistory.slice(1), waterReserve });

  disableCommands();

  input.value = "";
  main.innerHTML = inputHistory
    .map((text, i) =>
      i % 2 === 0
        ? `<p class="ai"><span>ROBOT</span>${text}</p>`
        : `<p class="user"><span>HUMAIN</span>${text}</p>`
    )
    .join("\n");
  main.scrollTop = main.scrollHeight;
};

input.onkeydown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendButton.click();
  }
};

restartButton.onclick = () => {
  window.location.reload();
};

function countTokens(text) {
  return text
    .trim()
    .split(/\s+|(?=[^\w])|(?<=[^\w])/)
    .filter(Boolean).length;
}

function tokenToLiters(tokens) {
  return tokens * LITER_PER_TOKENS;
}

function tokenToTime(tokens) {
  const time = tokens * 5000;
  return time;
}

function getPercent(value, max) {
  if (max === 0) {
    return "Max value cannot be zero.";
  }
  return (value / max) * 100;
}

function initialize() {
  main.innerHTML = inputHistory
    .map((text) => `<p class="ai"><span>ROBOT</span>${text}</p>`)
    .join("\n");

  water.style.height = "100%";
  totalWaterCost.textContent = `${waterReserve}`;
}

function disableCommands() {
  socket.emit("open");
  sendButton.disabled = true;
  input.disabled = true;
  input.placeholder = "Je réfléchis...";
  sendButton.textContent = "...";
  inputHistory.push("...");
}

function enableCommands() {
  socket.emit("close");
  sendButton.disabled = false;
  input.disabled = false;
  input.placeholder = "Délègues moi une tâche...";
  sendButton.textContent = "ENVOYER";
  input.focus();
  inputHistory.pop();
}

initialize();
