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
const inputHistory = [];

let waterReserve = WATER_RESERVE;
let currentAngle = 120;
let totalTokens = 0;

socket.on("current-angle", (angleValue) => {
  currentAngle = angleValue;
  console.log(`Angle command received from server: ${currentAngle}\n`);
});

socket.on("llm-response", async (response) => {
  enableCommands();

  // --- LLM response ---
  const textResponse = response.message.content;
  console.log("Response from LLM:", textResponse);

  const outputTokens = response.eval_count;
  totalTokens += outputTokens;
  waterConsomption.push(tokenToLiters(outputTokens));
  waterReserve -= tokenToLiters(outputTokens);

  if (waterReserve <= 0) {
    waterReserve = 0;
    water.style.display = "none";
    sendButton.disabled = true;
    input.disabled = true;

    promptCount.textContent = `${(inputHistory.length - 1) / 2}`;
    waterCount.textContent = `${WATER_RESERVE}`;
    tokensCount.textContent = `${totalTokens}`;

    inputHistory.push(
      `
        <u>Réserve d'eau épuisée !</u><br /><br />
        Tu as consommé toute ma réserve d'eau de <u>${WATER_RESERVE} litres</u>, <br />soit la consommation annuelle d'une plante d'intérieur moyenne.<br />
        Cela en seulement ${
          (inputHistory.length + 1) / 2
        } questions posées pour un total de ${totalTokens} tokens.<br /><br />
        <button id="restart" onclick="window.location.reload()">Recommencer</button>
      `
    );
  } else {
    inputHistory.push(textResponse);
  }

  // --- UI updates ---
  totalWaterCost.textContent = `${waterReserve.toFixed(2)}`;
  water.style.height = `${getPercent(waterReserve, WATER_RESERVE)}%`;
  renderMessages();
});

sendButton.onclick = () => {
  const prompt = input.value;
  if (!prompt.trim()) return;

  inputHistory.push(prompt);

  const inputTokens = countTokens(prompt);
  waterConsomption.push(tokenToLiters(inputTokens));

  socket.emit("llm-prompt", { prompts: inputHistory, waterReserve });

  disableCommands();
  renderMessages();
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

function getPercent(value, max) {
  if (max === 0) {
    return "Max value cannot be zero.";
  }
  return (value / max) * 100;
}

function initialize() {
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
  input.placeholder = "Poser une question";
  sendButton.textContent = "ENVOYER";
  input.focus();
  inputHistory.pop();
}

function renderMessages() {
  input.value = "";
  main.innerHTML = inputHistory
    .map((text, i) =>
      i % 2 === 0
        ? `<p class="user"><span>Humain ❤️</span>${text}</p>`
        : `<p class="ai"><span>Robot 🤖</span>${text}</p>`
    )
    .join("\n");
  main.scrollTop = main.scrollHeight;
}

initialize();
