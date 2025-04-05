// Pin assignments
#define RED_LED_PIN    9   // Main Red LED
#define GREEN_LED_PIN  10  
#define BLUE_LED_PIN   11  

#define SECOND_BLUE_LED_PIN 6  
#define SECOND_RED_LED_PIN 5  
#define SECOND_GREEN_LED_PIN 7

#define BUTTON_R       4   // Red button
#define BUTTON_G       2   // Green button
#define BUTTON_B       3   // Blue button

#define POT_B       A0   // Blue potentiometer
#define POT_G       A1   // Green potentiometer
#define POT_R       A3   // Red potentiometer

// Toggle state variables
bool redState   = false;
bool greenState = false;
bool blueState  = false;

// Variables for edge detection
int lastButtonRState = LOW;
int lastButtonGState = LOW;
int lastButtonBState = LOW;

void setup() {
  // Set LED pins as outputs
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT); 

  pinMode(SECOND_RED_LED_PIN, OUTPUT);
  pinMode(SECOND_BLUE_LED_PIN, OUTPUT); 
  pinMode(SECOND_GREEN_LED_PIN, OUTPUT);

  // Set button pins as inputs with internal pull-up resistors
  pinMode(BUTTON_R, INPUT_PULLUP);
  pinMode(BUTTON_G, INPUT_PULLUP);
  pinMode(BUTTON_B, INPUT_PULLUP);
  
  Serial.begin(9600);
}

void loop() {
  // Read current button states (LOW means pressed because of INPUT_PULLUP)
  int currentButtonR = digitalRead(BUTTON_R);
  int currentButtonG = digitalRead(BUTTON_G);
  int currentButtonB = digitalRead(BUTTON_B);

  // Toggle red state on a falling edge (HIGH to LOW transition)
  if (lastButtonRState == HIGH && currentButtonR == LOW) {
    redState = !redState;
    delay(100); // Simple debounce
  }
  
  // Toggle green state on a falling edge
  if (lastButtonGState == HIGH && currentButtonG == LOW) {
    greenState = !greenState;
    delay(100); // Simple debounce
  }

  // Toggle blue state on a falling edge
  if (lastButtonBState == HIGH && currentButtonB == LOW) {
    blueState = !blueState;
    delay(100); // Simple debounce
  }

  // Save the current button states for edge detection on next iteration
  lastButtonRState = currentButtonR;
  lastButtonGState = currentButtonG;
  lastButtonBState = currentButtonB;

  // Read potentiometer values
  int potValueB = analogRead(POT_B); 
  int potValueG = analogRead(POT_G); 
  int potValueR = analogRead(POT_R); 

  // Map potentiometer values to 0-255 range
  int blueBrightness = map(potValueB, 0, 1023, 0, 255); 
  int redBrightness = map(potValueR, 0, 1023, 0, 255); 
  int greenBrightness = map(potValueG, 0, 1023, 0, 255); 

  // If button is OFF, set the color to 0
  if (!redState) redBrightness = 0;
  if (!greenState) greenBrightness = 0;
  if (!blueState) blueBrightness = 0;

  // Control LEDs
  digitalWrite(SECOND_RED_LED_PIN, redState ? HIGH : LOW);  
  digitalWrite(SECOND_BLUE_LED_PIN, blueState ? HIGH : LOW);
  digitalWrite(SECOND_GREEN_LED_PIN, greenState ? HIGH : LOW);

  analogWrite(RED_LED_PIN, redBrightness);
  analogWrite(BLUE_LED_PIN, blueBrightness);
  analogWrite(GREEN_LED_PIN, greenBrightness);

  // Send RGB values to Serial for display
  Serial.print(redBrightness);
  Serial.print(",");
  Serial.print(greenBrightness);
  Serial.print(",");
  Serial.println(blueBrightness);

  delay(100); // Small delay to prevent data overflow
}
