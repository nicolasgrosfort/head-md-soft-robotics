int leftValue = 0;
int rightValue = 0;

void setup() {
  Serial.begin(9600);

}

void loop() {

  leftValue = analogRead(A0);
  rightValue = analogRead(A1);

  Serial.print(leftValue);
  Serial.print("::");
  Serial.println(rightValue);

  delay(50);
}
