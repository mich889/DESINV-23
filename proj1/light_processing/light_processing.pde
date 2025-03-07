import processing.serial.*;

Serial myPort;
int r = 0, g = 0, b = 0;

void setup() {
  fullScreen();  // Open fullscreen
  println("Available serial ports:");
  println(Serial.list());  // Print available ports
  
  // ✅ Manually set the correct port for macOS or Windows
  String portName = "/dev/cu.usbmodem2101"; // Adjust this based on Serial.list()
  myPort = new Serial(this, portName, 9600);
  myPort.clear();  // Clear serial buffer
  myPort.bufferUntil('\n');  // Wait for a full line before reading
}

void draw() {
  background(r, g, b);  // Set background to received color
}

void serialEvent(Serial myPort) {
  if (myPort.available() > 0) {  // Only read if data is available
    String data = myPort.readStringUntil('\n');  // Read a full line from serial

    if (data != null) {
      data = trim(data);
      println("Received raw data: [" + data + "]");  // Debugging: Show received data

      String[] rgbValues = split(data, ",");
      
      if (rgbValues.length == 3) {
        try {
          r = constrain(int(rgbValues[0]), 0, 255);
          g = constrain(int(rgbValues[1]), 0, 255);
          b = constrain(int(rgbValues[2]), 0, 255);
          println("Parsed RGB: " + r + ", " + g + ", " + b);  // Debugging parsed values
        } catch (Exception e) {
          println("Error parsing RGB: " + e.getMessage());
        }
      } else {
        println("Invalid data format: [" + data + "]");
      }
    }
  }
}
