#include <Servo.h>

Servo myServo;

void setup() {
  Serial.begin(9600);
  pinMode(A0, INPUT);
  myServo.attach(9);
}

void loop() {
  int soilValue = analogRead(A0);
  
  if (soilValue < 150) {
    int angle = random(0, 180);

    for (int pos = myServo.read(); pos != angle; pos += (angle > pos ? 1 : -1)) {
      myServo.write(pos);
      delay(15);
    }
  }

  Serial.print(0);
  Serial.print(" ");
  Serial.print(500);
  Serial.print(" ");
  Serial.println(soilValue); 

  delay(100); 
}
