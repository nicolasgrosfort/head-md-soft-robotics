#include <Servo.h>

Servo mainServo;
Servo shakeServo;

// --------------------
// Configuration
// --------------------
const int SERVO_PIN = 5;
const int SHAKE_SERVO_PIN = 6;
const int LIGHT_PIN = 3;
const int SOIL_PIN  = A0;

const int OPEN_ANGLE  = 30;
const int CLOSE_ANGLE = 120;

// Shake
const int SHAKE_CENTER = 90;
const int SHAKE_AMPLITUDE = 15;
const int SHAKE_INTERVAL = 50;

// State
bool isOpen = false;
bool shakeDirection = false;
unsigned long lastShakeTime = 0;

// Serial
String serialBuffer = "";

// --------------------
void setup() {
  Serial.begin(9600);

  pinMode(LIGHT_PIN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  mainServo.attach(SERVO_PIN);
  shakeServo.attach(SHAKE_SERVO_PIN);

  closeSystem();
}

// --------------------
void loop() {

  // Lecture série
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      serialBuffer.trim();
      handleCommand(serialBuffer);
      serialBuffer = "";
    } 
    else if (c != '\r') {
      serialBuffer += c;
    }
  }

  // Shake actif uniquement si ouvert
  if (isOpen) {
    unsigned long now = millis();
    if (now - lastShakeTime >= SHAKE_INTERVAL) {
      lastShakeTime = now;
      int offset = shakeDirection ? SHAKE_AMPLITUDE : -SHAKE_AMPLITUDE;
      shakeServo.write(SHAKE_CENTER + offset);
      shakeDirection = !shakeDirection;
    }
  }

  sendState();
  delay(15);
}

// --------------------
// Commandes
// --------------------
void handleCommand(String cmd) {
  if (cmd.equalsIgnoreCase("OPEN")) {
    openSystem();
  }
  else if (cmd.equalsIgnoreCase("CLOSE")) {
    closeSystem();
  }
}

// --------------------
void openSystem() {
  mainServo.write(OPEN_ANGLE);
  digitalWrite(LIGHT_PIN, HIGH);
  digitalWrite(LED_BUILTIN, HIGH);

  isOpen = true;

  Serial.println("STATE::OPEN");
}

// --------------------
void closeSystem() {
  mainServo.write(CLOSE_ANGLE);
  shakeServo.write(SHAKE_CENTER);

  digitalWrite(LIGHT_PIN, LOW);
  digitalWrite(LED_BUILTIN, LOW);

  isOpen = false;

  Serial.println("STATE::CLOSE");
}

// --------------------
// Feedback état
// --------------------
void sendState() {
  Serial.print("ANGLE::");
  Serial.println(mainServo.read());

  Serial.print("SOIL::");
  Serial.println(analogRead(SOIL_PIN));
}