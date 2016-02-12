
#define ANALOG_QTY 4

int analogReading[ANALOG_QTY];
int analogReadingPrev[ANALOG_QTY];

void setup() {
  for(int i = 0; i < ANALOG_QTY; i++) {
    // Initialize the arrays
    analogReading[i] = 0;
    analogReadingPrev[i] = 0;
  }
  // start serial port at 9600 bps and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
}

void loop() {
  for(int i = 0; i < ANALOG_QTY; i++) {
    // Read input
    analogReading[i] = analogRead(i);
    // Compare to previous one
    if (analogReading[i] != analogReadingPrev[i]) {
      // Send to computer if it changed
      analogReadingPrev[i] = analogReading[i];
      sendReading("analog", i, analogReading[i]);
    }
  }
  if (Serial.read() > 0) {
    // Send all current readings if we received something
    for(int i = 0; i < ANALOG_QTY; i++) {
      sendReading("analog", i, analogReading[i]);
    }
  }
  delay(10); // Enhance your calm
}

void sendReading(char type[], int i, int reading) {
  Serial.print(type);
  Serial.print(i);
  Serial.print(":");
  Serial.print(reading);
  Serial.print("\n");
}
