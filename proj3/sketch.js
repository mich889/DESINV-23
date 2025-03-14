/**
Michelle Chen
March 14
"Eyes On You"
This piece of generative art traansforms the viewer's gaze into an interactive experience using real time eye tracking and replicates them across an expensive grid of digital eyes. There is randomization in the color generated as well as the blinks, with the speed of change increasing as a user gets closer to the camera, highlighting the feelign of surveillance of scruitinty when being observed up close.
**/

let capture = null;
let tracker = null;
let positions = null;
let w = 0, h = 0;

let currentIrisColor;
let nextUpdateFrame = 0;

function setup() {
  w = windowWidth;
  h = windowHeight;
  capture = createCapture(VIDEO);
  createCanvas(w, h);
  capture.size(w, h);
  capture.hide();

  frameRate(10);
  colorMode(HSB);
  background(0);

  // Initialize clmtrackr
  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
  
  currentIrisColor = color(random(360), 80, 80, 0.4);
}

function draw() {
  background(0);
  
  // Mirror the canvas for a mirror effect
  push();
  translate(w, 0);
  scale(-1.0, 1.0);
  
  positions = tracker.getCurrentPosition();

  if (positions.length > 0) {
    // Create eye objects from clmtrackr landmarks:
    const eye1 = {
      outline: [23, 63, 24, 64, 25, 65, 26, 66].map(getPoint),
      center: getPoint(27),
      top: getPoint(24),
      bottom: getPoint(26)
    };
    const eye2 = {
      outline: [28, 67, 29, 68, 30, 69, 31, 70].map(getPoint),
      center: getPoint(32),
      top: getPoint(29),
      bottom: getPoint(31)
    };
    
    // Normalize the eye shapes so that the center is at (0,0)
    let normEye1 = {
      outline: eye1.outline.map(p => p5.Vector.sub(p, eye1.center)),
      center: createVector(0, 0),
      top: p5.Vector.sub(eye1.top, eye1.center),
      bottom: p5.Vector.sub(eye1.bottom, eye1.center)
    };
    let normEye2 = {
      outline: eye2.outline.map(p => p5.Vector.sub(p, eye2.center)),
      center: createVector(0, 0),
      top: p5.Vector.sub(eye2.top, eye2.center),
      bottom: p5.Vector.sub(eye2.bottom, eye2.center)
    };
    
    // Compute the distance between the two eye centers as a proxy for face proximity.
    let d = dist(eye1.center.x, eye1.center.y, eye2.center.x, eye2.center.y);
    // Map distance to an update period: when d is small (face far), update slowly;
    // when d is large (face close), update faster.
    let updatePeriod = floor(map(d, 50, 200, 10, 2));
    if (frameCount >= nextUpdateFrame) {
      currentIrisColor = color(random(360), 80, 80, 0.4);
      nextUpdateFrame = frameCount + updatePeriod;
    }
    
    // Set up grid dimensions for replicating the eyes:
    let gridCols = 6;   
    let gridRows = 10; 
    let cellWidth = w / gridCols;
    let cellHeight = h / gridRows;
    let scaleFactor = 3;  
    
    // Loop over grid cells and draw the normalized eyes in each cell.
    // Each cell gets its own blink timing based on its grid indices.
    for (let i = 0; i < gridCols; i++) {
      for (let j = 0; j < gridRows; j++) {
        push();
        // Center each eye copy in its grid cell:
        let x = i * cellWidth + cellWidth / 2;
        let y = j * cellHeight + cellHeight / 2;
        translate(x, y);
        // Draw both eyes using the currentIrisColor.
        drawEye(normEye1, currentIrisColor, scaleFactor, i, j);
        drawEye(normEye2, currentIrisColor, scaleFactor, i, j);
        pop();
      }
    }
  }
  
  pop();
}

function getPoint(index) {
  return createVector(positions[index][0], positions[index][1]);
}

//draws normalized eye
function drawEye(eye, irisColor, scaleFactor, gridI, gridJ) {
  let blinkValue = noise(gridI * 100, gridJ * 100, frameCount * 0.1);
  let threshold = 0.3;
  let blinkAmt = blinkValue < threshold ? map(blinkValue, 0, threshold, 1, 0) : 0;
  
  push();
  scale(scaleFactor);
  if (blinkAmt > 0) {
    // Compute iris size based on normalized distances.
    let irisRadius = min(eye.top.mag(), eye.bottom.mag());
    let irisSize = irisRadius * 2;
    
    // Draw black eyelids that slide in from top and bottom.
    let topLidBottom = lerp(-irisSize / 2, 0, blinkAmt);
    let bottomLidTop = lerp(irisSize / 2, 0, blinkAmt);
    
    noStroke();
    fill(0);
    rectMode(CORNERS);
    rect(-irisSize / 2, -irisSize / 2, irisSize / 2, topLidBottom);
    rect(-irisSize / 2, bottomLidTop, irisSize / 2, irisSize / 2);
    pop();
    return;
  }
  
  // Not blinking: Draw the eye normally.
  noFill();
  stroke(255, 0.4);
  beginShape();
  let first = eye.outline[0];
  for (let k = 0; k < eye.outline.length; k++) {
    let p = eye.outline[k];
    curveVertex(p.x, p.y);
    if (k === 0) {
      curveVertex(first.x, first.y);
    }
    if (k === eye.outline.length - 1) {
      curveVertex(first.x, first.y);
      curveVertex(first.x, first.y);
    }
  }
  endShape();
  
  let irisRadius = min(eye.top.mag(), eye.bottom.mag());
  let irisSize = irisRadius * 2;
  
  noStroke();
  fill(irisColor);
  ellipse(0, 0, irisSize, irisSize);
  
  const pupilSize = irisSize / 3;
  fill(0, 0.6);
  ellipse(0, 0, pupilSize, pupilSize);
  pop();
}

function keyPressed() {
  background(0);
}

function mouseClicked() {
  const timestamp = timestampString();
  saveCanvas("eyeTrail-" + timestamp, "png");
}

function timestampString() {
  return year() + nf(month(), 2) + nf(day(), 2) + "-" +
         nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w, h);
  background(0);
}
