let serial;
let latestData = 'waiting for data';

let bananaFreq, carrotFreq;
let bananaSynth, carrotSynth;

let targetBananaFreq = 0;
let targetCarrotFreq = 0;
let currentBananaFreq = 0;
let currentCarrotFreq = 0;
let lerpAmount = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);

  bananaSynth = new p5.MonoSynth();
  carrotSynth = new p5.MonoSynth();

  serial = new p5.SerialPort();
  serial.list();
  serial.open('/dev/tty.usbmodem2101');
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);
}

function serverConnected() {
  print('Connected to Server');
}

// Got the list of ports
function gotList(thelist) {
  print('List of Serial Ports:');
  for (let i = 0; i < thelist.length; i++) {
    print(i + ' ' + thelist[i]);
  }
}

function gotOpen() {
  print('Serial Port is Open');
}

function gotClose() {
  print('Serial Port is Closed');
  latestData = 'Serial Port is Closed';
}

function gotError(theerror) {
  print(theerror);
}

function gotData() {
  let currentString = serial.readLine();
  trim(currentString);
  if (!currentString) return;
  console.log(currentString);
  latestData = currentString;

  let values = latestData.split('::').map(Number);
  if (values.length === 2 && !isNaN(values[0]) && !isNaN(values[1])) {
    targetBananaFreq = values[0];
    targetCarrotFreq = values[1];
  }
}

function gotRawData(thedata) {
  print('gotRawData' + thedata);
}

function draw() {
  background(255, 255, 255);
  fill(0, 0, 0);
  text(latestData, 10, 10);

  let velocity = 1;
  let time = 0;
  let dur = 1 / 6;

  currentBananaFreq = lerp(
    currentBananaFreq,
    targetBananaFreq,
    lerpAmount,
  );
  currentCarrotFreq = lerp(
    currentCarrotFreq,
    targetCarrotFreq,
    lerpAmount,
  );

  bananaSynth.play(currentBananaFreq, velocity, time, dur);
  carrotSynth.play(currentCarrotFreq, velocity, time, dur);

  console.info(currentBananaFreq, currentCarrotFreq);
}

function mousePressed() {
  playSynth();
}

function playSynth() {
  userStartAudio();
}
