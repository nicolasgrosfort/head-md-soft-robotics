import socket from "./socket.js";
import { lerp } from "./utils.js";

let port;
let writer;
let reader;
let buffer = "";

let isConnected = false;

let currentSoil = 0;
let currentAngle = 0;
let currentLight = false;

let smoothValue = 0;
let alpha = 0.005;

const MAX_WATER = 520;

const connectButton = document.querySelector("#connect");
const angleLabel = document.querySelector("#angle");
const soilLabel = document.querySelector("#soil");
const statusLabel = document.querySelector("#status");

socket.on("next-light", (status) => {
  send(`LIGHT::${status ? 1 : 0}`);
  console.log(`Light status from server: ${status}\n`);
});

socket.on("open-for", ({ angle, duration }) => {
  send(`OPEN::${angle},${duration}`);
  console.log(
    `Open for command received from server: angle=${angle}, duration=${duration}\n`
  );
});

socket.on("open", () => {
  send(`OPEN`);
});

socket.on("close", () => {
  send(`CLOSE`);
});

socket.on("next-angle", (angle) => {
  send(`ANGLE::${angle}`);
  console.log(`Angle command received from server: ${angle}\n`);
});

connectButton.addEventListener("click", async () => {
  if (!isConnected) {
    await connect();
  }
});

async function connect() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    // ---- WRITE (web → arduino)
    const encoder = new TextEncoderStream();
    encoder.readable.pipeTo(port.writable);
    writer = encoder.writable.getWriter();

    // ---- READ (arduino → web)
    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    reader = decoder.readable.getReader();

    readLoop();

    isConnected = true;
    socket.emit("connected", true);
    statusLabel.style.backgroundColor = isConnected
      ? "lightgreen"
      : "lightcoral";
  } catch (e) {
    console.error("Erreur ou aucun port sélectionné:", e);
  }
}

function send(value) {
  if (!writer) return;
  writer.write(value + "\n");
}

async function readLoop() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (!value) continue;

    buffer += value;

    let lines = buffer.split("\n");
    buffer = lines.pop();

    lines.forEach((line) => {
      handleLine(line.trim());
    });
  }
}

function handleLine(line) {
  const soilParse = parse(line, "SOIL::");
  const angleParse = parse(line, "ANGLE::");
  const lightParse = parse(line, "LIGHT::");

  console.log({ line, soilParse, angleParse, lightParse });

  currentAngle = angleParse !== -1 ? Number(angleParse) : currentAngle;
  currentLight =
    lightParse === 1 ? true : lightParse === 0 ? false : currentLight;
  const rawSoil = soilParse !== -1 ? Number(soilParse) : currentSoil;

  // Lisser la valeur du sol
  currentSoil = lerp(currentSoil, rawSoil, alpha);

  socket.emit("current-soil", Math.round(currentSoil));
  socket.emit("current-angle", currentAngle);
  socket.emit("current-light", currentLight);

  angleLabel.textContent = currentAngle.toString();
  soilLabel.textContent = Math.round(currentSoil).toString();
}

function parse(input, prefix) {
  if (input.startsWith(prefix)) {
    return Number(input.slice(prefix.length));
  }

  return -1;
}
