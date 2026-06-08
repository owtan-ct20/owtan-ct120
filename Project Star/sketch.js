let slices;
let numSlices;
let currentSlice

let characterImages = [];
let characterImg;
let characterPicked;

let currentCup;
let cups = [];
let posChanges = [];
let trophyCase = [];

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

let turnCount;
let racePosition;
let displayPos
let raceOver;


function setup() {
  createCanvas(800, 400);
  slices = ["Mario", "Luigi", "Peach", "Toad", "DK", "Wario", "Yoshi", "Bowser"];
  numSlices = slices.length;
  
  for(let i = 0; i < numSlices; i++){
    characterImages.push(loadImage("characters/" + slices[i] + ".png"))
  }
  characterPicked = false;
  
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
  if (!spinning && dist(mouseX, mouseY, wheelX, wheelY) <= 150) {
    angle = 0;
    targetAngle = random(PI, TWO_PI) * 5;
    speed = targetAngle / 50;
    spinning = true;
  }
}

function spinDaWheel(){
  translate(wheelX, wheelY);

  let sliceAngle = TWO_PI / numSlices;

  for (let i = 0; i < numSlices; i++) {
    startAngle = i * sliceAngle + angle;
    endAngle = (i + 1) * sliceAngle + angle;
    if(i % 2 == 0){
      fill(255);
    } else {
      fill(120);
    }
    stroke(0);
    strokeWeight(2);
    arc(0, 0, 300, 300, startAngle, endAngle, PIE);

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

  fill(255, 0, 0);
  noStroke();
  triangle(160, -10, 160, 10, 140, 0);

  if (spinning) {
    angle += speed;
    speed *= deceleration;
    normAngle = ((angle % TWO_PI) + TWO_PI) % TWO_PI;
    currentSlice = Math.floor((((0 - normAngle) % TWO_PI + TWO_PI) % TWO_PI) / sliceAngle);

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

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = 20 + col * (cellSize + padding);
      let y = 70 + row * (cellSize + padding);

      fill(255);
      stroke(0);
      rect(x, y, cellSize, cellSize);
      
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

function drawCup(){
  slices = cups;
  numSlices = slices.length;
  displayedMessage = "Which cup are you racing?"
}
function drawRace(){
  slices = posChanges;
  numSlices = slices.length;
  fill(0);
  text("Position: " + displayPos, width/4, height/2 + 50)
  displayedMessage = "Turn " + turnCount + ". Position Change?";
}

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
  
  if(turnCount > 25){
    raceOver = true;
  }
}

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
