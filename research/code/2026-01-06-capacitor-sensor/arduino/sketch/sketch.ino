#include <CapacitiveSensor.h>

// pin 4 sends electrical energy
// pin 2 senses senses a change
CapacitiveSensor bananaSensor = CapacitiveSensor(4, 2);
CapacitiveSensor carrotSensor = CapacitiveSensor(8, 7);




void setup() {
  Serial.begin(9600);
}

void loop() {
  long bananaValue = bananaSensor.capacitiveSensor(30);
  long carrotValue = carrotSensor.capacitiveSensor(30);

  Serial.print(bananaValue);
  Serial.print("::");
  Serial.println(carrotValue);

  delay(10);
}
