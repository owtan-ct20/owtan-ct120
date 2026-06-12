/*Game where you play Mario Kart except your entire game is decided randomly by a wheel. I was inspired by this other game I saw where someone made a Pokemon ROM hack where everything is decided by gambling. I thought it would be funny to try and do something similar.

I couldn't finish it in time but I think the concept is there. The end product should have you go until you lose or win all the cups. I also wanted to add items that you could randomly get during the races to affect your racing, which is why there's some white space in the bottom right.*/

let slices;
let numSlices;
let currentSlice

let characterImages = [];
let characterImg;
let characterPicked;

//Changed a lot here while I was thinking about how I wanted the game to progress before settling on hard coding some arrays in with the images I wanted.
let currentCup;
let cups = [];
let posChanges = [];
let trophyCase = [];


//A buncha variables for the wheel. I admittedly looked online for help on how to do this and understand how it works. 
let angle;
let targetAngle;
let normAngle
let spinning;
let speed;
let deceleration = 0.98;
let startAngle;
let endAngle;
let displayedMessage;
let wheelX;
let wheelY;
let scene;

//variables for deciding progression. 
let turnCount;
let racePosition;
let displayPos
let raceOver;


function setup() {
  createCanvas(800, 400);
  
  //array for the initial wheel
  slices = ["Mario", "Luigi", "Peach", "Toad", "DK", "Wario", "Yoshi", "Bowser"];
  numSlices = slices.length;
  
  //loads the character images into an array
  for(let i = 0; i < numSlices; i++){
    characterImages.push(loadImage("characters/" + slices[i] + ".png"))
  }
  characterPicked = false;
  
  //some arrays to use for the wheel later.
  cups = ["Mushroom", "Flower","Star","Shell","Banana","Leaf","Lightning","Special"]
  posChanges = ["Forward 1", "Forward 2", "Back 1", "Back 2","Forward 1", "Forward 2"]
  
  angle = 0;
  targetAngle = 0;
  spinning = false;
  speed = 0;
  displayedMessage = "Choose your rider!"
  wheelX = width / 4;
  wheelY = height / 2 + 30
  scene = "rider"
  turnCount = 1;
  racePosition = 12;
  displayPos = racePosition;
  raceOver = false;
}

function draw() {
  background(220);
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(displayedMessage, wheelX-300/2, wheelY-250, 300, 100)
  
  spinDaWheel();
  
  drawTrophies();
  
  if(scene != "rider"){
    drawCharacter();
  }
  
  //Using a switch to allow for moving back and forth between scenes. In my head I would have different events pop up during races where it would change to like an "items" scene or "shortcut" scene for more randomness during the race.
  switch(scene){
    case "cup":
      drawCup();
      break;
      
    case "race":
      drawRace();
      break;
      
    default:
      break;
  }
}

function mouseClicked() {
  //checks if the wheel isn't spinning and you clicked inside it and start spinning the wheel if you did
  if (!spinning && dist(mouseX, mouseY, wheelX, wheelY) <= 150) {
    angle = 0;
    targetAngle = random(PI, TWO_PI) * 5;
    speed = targetAngle / 50;
    spinning = true;
  }
}

/*The most confusing part of the project, mostly for math reasons. The function takes the number of slices then calculates the angle of equally sized arcs for the number of slices and draws that. It draws a pointer on the right side and whatever slice is under the pointer is the selected slice, which corresponds to a place in the arrays I've hard coded for the wheels, and I use the result to determine what happens next. */
function spinDaWheel(){
  translate(wheelX, wheelY);

  let sliceAngle = TWO_PI / numSlices;

  for (let i = 0; i < numSlices; i++) {
    startAngle = i * sliceAngle + angle;
    endAngle = (i + 1) * sliceAngle + angle;
    
    //colors the slices, ideally in a complete program this would have real colors that correspond with the thing on the wheel, like using red for Mario.
    if(i % 2 == 0){
      fill(255);
    } else {
      fill(120);
    }
    stroke(0);
    strokeWeight(2);
    arc(0, 0, 300, 300, startAngle, endAngle, PIE);

    //section below determines where to put the text on the wheel
    fill(0);
    strokeWeight(1);
    let midAngle = (startAngle + endAngle) / 2;
    let textRadius = 150 * 0.78;
    let nameX = cos(midAngle) * textRadius;
    let nameY = sin(midAngle) * textRadius;
    
    push();
    translate(nameX, nameY);
    rotate(midAngle + HALF_PI);
    textAlign(CENTER, CENTER);
    textSize(20);
    let textToShow = slices[i];
    while (textWidth(textToShow) > 70) {
      textSize(textSize() - 1);
    }
    text(textToShow, 0, 0);
    pop();
  }

  //makes the pointer
  fill(255, 0, 0);
  noStroke();
  triangle(160, -10, 160, 10, 140, 0);

  //spins the wheel when you click on it
  if (spinning) {
    angle += speed;
    speed *= deceleration;
    normAngle = ((angle % TWO_PI) + TWO_PI) % TWO_PI;
    currentSlice = Math.floor((((0 - normAngle) % TWO_PI + TWO_PI) % TWO_PI) / sliceAngle);

    //stops the wheel when it's slow enough and logs what it landed on before progressing the scene based on the result.
    if (speed < 0.001) {
      spinning = false;
      speed = 0;
      console.log(currentSlice)
      
      alert("Selected: " + slices[currentSlice]);
      if(scene == "race" && !raceOver){
        doRace();
      }
      
      progressScene();
    }
  }
  translate(-wheelX, -wheelY);
}

//Draws the grid on the right that has the trophies you've won during your run. I think in a completed project I would tint the images of the trophies to represent if you got first, second, third, or worse.
function drawTrophies() {
  translate(width/2, 0);
  fill(0)
  textSize(20);
  text("Trophies", width/4-50, 30)

  let cols = 4;
  let rows = 2;
  let cellSize = 60;
  let padding = 10;

  fill(240, 215, 0);
  stroke(0);
  rect(0, 50, cols * (cellSize + padding) + 30, rows * (cellSize + padding) + 30);

  //builds the grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = 20 + col * (cellSize + padding);
      let y = 70 + row * (cellSize + padding);

      fill(255);
      stroke(0);
      rect(x, y, cellSize, cellSize);
      
      //If the trophy case has objects in it, draws them and tints it gold. Would ideally tint it differently based on placing.
      let index = row * cols + col;
      if (trophyCase[index]) {
        let trophyImg = trophyCase[index];
        
        let scale = min(
          cellSize / trophyImg.width,
          cellSize / trophyImg.height
        );
        tint(240, 175, 55)
        image(trophyCase[index], x + (cellSize - trophyImg.width * scale) / 2, y + (cellSize - trophyImg.height * scale) / 2, trophyImg.width * scale, trophyImg.height * scale);
        noTint();
      }
    }
  }
}

//Draws the character you were assigned and makes sure it doesn't change afterwards.
function drawCharacter(){
  rect(0, height/2 + 40 , height/4 + 40, height/4 + 40);
  //console.log(height/4 + 40);
  
  if(!characterPicked){
    characterImg = characterImages[currentSlice];
    characterPicked = true;
  }
  let scale = min(140 / characterImg.width,140 / characterImg.height);
  let imgWidth = characterImg.width * scale;
  let imgHeight = characterImg.height * scale;
  
  image(characterImg, (140 - imgWidth) / 2, (height/2 + 40) + (140 - imgHeight) / 2, imgWidth, imgHeight);
}

//Draws the wheel that determines which cup you race.
function drawCup(){
  slices = cups;
  numSlices = slices.length;
  displayedMessage = "Which cup are you racing?"
}

//Draws the possible results for a turn while racing on the wheel. Ideally this would be more than just moving forward and back and have stuff like picking up items and stuff but for the sake of simplicity in the logic, I wanted to make sure the actual race part worked first.
function drawRace(){
  slices = posChanges;
  numSlices = slices.length;
  fill(0);
  text("Position: " + displayPos, width/4, height/2 + 50)
  displayedMessage = "Turn " + turnCount + ". Position Change?";
}

//Checks what slice you landed on and moves your placement accordingly. If you're sufficiently far ahead, you have a little bit of buffer space before dropping below first.
function doRace(){
  turnCount++;
  switch (slices[currentSlice]){
    case "Forward 1":
      racePosition--;
      break;
    case "Forward 2":
      racePosition -= 2;
      break;
    case "Back 1":
      racePosition++;
      break;
    case "Back 2":
      racePosition += 2;
      break;
  }
  if(racePosition > 12){
    racePosition = 12;
  } else if (racePosition <= -3){
    racePosition = -3;
  }
  
  displayPos = racePosition;
  if(racePosition <=1){
    displayPos = 1;
  }
  console.log(scene, racePosition)
  
  //ends the race after 25 turns.
  if(turnCount > 25){
    raceOver = true;
  }
}

//Determines which scene to move to after the wheel stops. This is mostly based on what the current scene is. In a completed project, this would also take into account what the wheel landed on because something like the race wheel could send you to different scenes such as an item scene or shortcut scene. 
function progressScene(){
  if(scene == "cup"){
    currentCup = slices[currentSlice];
    cups.splice(currentSlice, 1);
    
    scene = "race";
    turnCount = 1;
    racePosition = 12;
    raceOver = false;
  }
  if(scene == "rider"){
    scene = "cup";
  } 
  if(scene == "race" && raceOver){
    scene = "cup"
    let loadedImage = loadImage("trophies/" + currentCup + ".png")
    //console.log(loadedImage);
    trophyCase.push(loadedImage)
  }
}
