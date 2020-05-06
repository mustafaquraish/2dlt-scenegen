// Stores Objects
var CIRCLES, LIGHT; 

// States for FSM
const WAIT = 0, DRAW = 1, DRCI = 2, DRLI = 3, RTLI = 4, EDOB = 5;
var CURC, MODE, ix, iy;

const CANVASSIZE = 600;

var howTo, objProp;
var mtrl, ioref, updBtn;
var MAT_LIST = ['mirr', 'diff', 'refr'];

function setup() {

  // Init some default objects
  CIRCLES = [{x:400,y:150,r:100,m:2,i:1.6}];
  LIGHT =    {x:200, y:500, r:10, a:2.523};
  MODE = WAIT;  // Waiting State to begin with


  // Create and manage canvas
  var canvas = createCanvas(CANVASSIZE, CANVASSIZE);
  canvas.parent('canv');
  canvas.mousePressed(canvasMousePressed);
  canvas.mouseReleased(canvasMouseReleased);

  // Change aspect ratio
  select('#setAR').mousePressed(() => {
    let w = int(select('#dimW').value());
    let h = int(select('#dimH').value());
    let nW = w/min(w,h) * CANVASSIZE;
    let nH = h/min(w,h) * CANVASSIZE;
    canvas = resizeCanvas(nW,nH);
  });

  select('#export').mousePressed(exportFile);

  matrl = select('#matrl');
  ioref = select('#ioref');
  updBtn = select('#updBtn');

  // Modal Management, using native JS here because I don't know how to do this 
  // using the p5.js dom library. TODO: Figure it out.

  // Get the modal
  howTo = document.getElementById('myModal');
  objProp = document.getElementById('objPropModal');

  var openBtn = document.getElementById("modalBtn");
  var closeBtn = document.getElementsByClassName("close")[0];
  var closeBtn2 = document.getElementsByClassName("close")[1];

  // Set the actions to open/close
  openBtn.onclick = () => { howTo.style.display = "block"; }
  closeBtn.onclick = () => { howTo.style.display = "none"; } 
  closeBtn2.onclick = () => { objProp.style.display = "none"; }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = (e) => { if (event.target == howTo) howTo.style.display = "none"; }
  window.onclick = (e) => { if (event.target == objProp) objProp.style.display = "none"; }

  updBtn.mouseReleased(() => {
    objProp.style.display = "none";
    CIRCLES[CURC].m = MAT_LIST.indexOf(document.getElementById('matrl').value);
    CIRCLES[CURC].i = document.getElementById('ioref').value;
  });
}


function mouseOnLight() {
  // Is the mouse on the light?
  return (dist(LIGHT.x, LIGHT.y, mouseX, mouseY) < LIGHT.r);
}


function mouseOnCircle() {
  // If mouse on circle, return index of circle it is on.
  // Otherwise return undefined.

  // Circles added later are on 'top' of older ones, so we're going backwards
  for (let i = CIRCLES.length-1; i >= 0; i--) {
    if (dist(CIRCLES[i].x, CIRCLES[i].y, mouseX, mouseY) < CIRCLES[i].r) {
      return i;
    } 
  }
  return undefined;
}


function canvasMousePressed() {
  console.log("PRESS");
  // Event handler for mouse pressed on Canvas. Handles the FSM transitions as
  // necessary.

  // Light is being rotated, nothing to do here.
  if (MODE == RTLI) { return; }

  CURC = mouseOnCircle();

  // Center button deletes the circle you're on.
  if (mouseButton == CENTER) {
    if (CURC !== undefined) {
      CIRCLES.splice(CURC,1);
    }
    return;
  }

  
  ix = mouseX; iy = mouseY;
  
  if (mouseOnLight()) {
    MODE = DRLI;                // Move the light. Always on top.
  } else if (CURC !== undefined) {  
    MODE = DRCI;                // Move the circle you're on.
  } else {
    MODE = DRAW;                // Draw a new circle
  } 
}

function keyPressed() {
  // Event handler for key-press on page. Used for duplicating objects, can
  // add more shortcuts in the future...

  if (keyCode === 32) {   // SPACE BAR to duplicate.
    let c = mouseOnCircle();
    if (c !== undefined) {
      CIRCLES.push(Object.assign({}, CIRCLES[c]));
    }
  }
}

function canvasMouseReleased() {
  // Event handler for mouse released on Canvas. Handles the FSM transitions as
  // necessary.

  if (ix == mouseX && iy == mouseY) {
    if (MODE == DRLI) {
      MODE = RTLI;
      return;
    } else if (MODE == DRCI) {
      document.getElementById('matrl').value = MAT_LIST[CIRCLES[CURC].m];
      document.getElementById('ioref').value = CIRCLES[CURC].i; 
      objProp.style.display = "block";
      MODE = WAIT;
      return;    
    } else if (MODE == DRAW) {
      MODE = WAIT;
      return;
    }
  }
  

  if (MODE == DRAW) { 
    CIRCLES.push({x:ix, y:iy, r:dist(ix, iy, mouseX, mouseY),m:2,i:1.6}); 
  } 
  MODE = WAIT;
}

function draw() {
  // Main draw loop. Updates values as necessary when actions are happening.
  // Responsible for moving all the objects, updating directions, drawing the
  // sketch onto the canvas to visualise the scene.

  background(200);


  if (MODE == DRCI) { // Move the objects around
    CIRCLES[CURC].x += (mouseX - pmouseX);
    CIRCLES[CURC].y += (mouseY - pmouseY);
  } else if (MODE == DRLI) {  // Move the light around
    LIGHT.x += (mouseX - pmouseX);
    LIGHT.y += (mouseY - pmouseY);
  } else if (MODE == RTLI) {  // Change the direction of the light
    let a1 = createVector(mouseX - LIGHT.x, mouseY - LIGHT.y);
    let ang = PI/2 - a1.heading();
    LIGHT.a = ang;
  }

  // Draw the circles (including the one being drawn)
  stroke(0); fill(255);
  for (circ of CIRCLES) { ellipse(circ.x, circ.y, circ.r*2); }
  if (MODE == DRAW) { ellipse(ix, iy, dist(ix, iy, mouseX, mouseY)*2); } 

  // Fill is red if you're currently changing the angle.
  if (MODE == RTLI) { fill(255,0,0); }
  else { fill(255,255,0); }
  ellipse(LIGHT.x, LIGHT.y, LIGHT.r*2);
  line(LIGHT.x, // Draw the line to show the direction the L.S is facing.
      LIGHT.y, 
      LIGHT.x + 3*LIGHT.r*sin(LIGHT.a), 
      LIGHT.y + 3*LIGHT.r*cos(LIGHT.a));
}