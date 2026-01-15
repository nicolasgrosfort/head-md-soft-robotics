import socket from "./socket.js";

let currentSoil = 0;
let currentAngle = 0;
let currentLight = false;
let isConnected = false;
let canWater = false;

const WATER_ON = 30;
const WATER_OFF = 120;
const WATER_THRESHOLD = 200;
const MAX_WATER = 520;

const statusDiv = document.querySelector("#status");
const wateringButton = document.querySelector("#watering");
const angleLabel = document.querySelector("#angle");
const soilLabel = document.querySelector("#soil");
const lightButton = document.querySelector("#light");

lightButton.onclick = () => {
  socket.emit("next-light", !currentLight);
  console.log("Light toggle command sent to server.\n");
};

socket.on("current-angle", (angleValue) => {
  currentAngle = angleValue;
  console.log(`Angle command received from server: ${currentAngle}\n`);
  angleLabel.textContent = currentAngle;
});

socket.on("current-light", (lightStatus) => {
  currentLight = lightStatus;
  console.log(`Light status received from server: ${currentLight}\n`);
  lightButton.textContent = currentLight
    ? "Éteindre la lumière"
    : "Allumer la lumière";
});

// socket.on("current-soil", (soilValue) => {
//   currentSoil = soilValue;
//   canWater = currentSoil > 0 && currentSoil <= WATER_THRESHOLD;
//   console.log(`Soil data received from server: ${currentSoil}\n`);

//   if (!canWater) {
//     socket.emit("next-angle", WATER_OFF);
//   }

//   soilLabel.textContent = currentSoil;
// });

socket.on("connected", (status) => {
  isConnected = status;
  console.log(`Connection status from server: ${isConnected}\n`);
  statusDiv.style.backgroundColor = isConnected ? "lightgreen" : "lightcoral";
});

wateringButton.onclick = () => {
  if (currentAngle >= WATER_OFF) {
    socket.emit("next-angle", WATER_ON);
    wateringButton.textContent = "Fermer";
  } else {
    socket.emit("next-angle", WATER_OFF);
    wateringButton.textContent = "Ouvrir";
  }

  console.log(`Watering command sent. Current angle: ${currentAngle}\n`);
};
