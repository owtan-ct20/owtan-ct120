let data;
let pokemonData;
let pokeID;
let pkmnImg;
let displayedImg;
let previousButton;
let nextButton;
let crunchiness;

function setup() {
  createCanvas(800, 800);
  pokeID = 1;
  displayedImg = createImg("bulbasaur.png", "pokemon");
  displayedImg.position(width/5, height/5);
  crunchiness = 200;
  
  previousButton = createButton('previous');
  previousButton.position(0, 9*height/10);
  
  nextButton = createButton('next');
  nextButton.position(9*width/10, 9*height/10);
  
  previousButton.mousePressed(prevPage);
  nextButton.mousePressed(nextPage);
  
  findPokemon("https://pokeapi.co/api/v2/pokemon/" + pokeID)
}

function draw() {
  background(220);
  rect(width/10, height/10, 4*width/5, 4*height/5);
}

async function findPokemon(data){
  pokemonData = loadJSON(data, pokemonSuccess, pokemonFailed);
}

function pokemonSuccess(data) {   
  pokemonData = data;
  console.log(pokemonData);
  
  loadImage(
    data.sprites.other["official-artwork"].front_default,
    function(img) {
      let cronch = createGraphics(crunchiness, crunchiness);
      cronch.image(img, 0, 0, crunchiness, crunchiness);
      
      let resizedImg = createGraphics(width/3, height/3);
      resizedImg.noSmooth();
      resizedImg.image(cronch, 0, 0, width/3, height/3);

      displayedImg.attribute('src', resizedImg.canvas.toDataURL());
    }
  );
}

function pokemonFailed(error) {
  console.log("error");
}

function prevPage(){
  if(pokeID > 1){
    pokeID--;
    findPokemon("https://pokeapi.co/api/v2/pokemon/" + pokeID);
  }
}

function nextPage(){
  pokeID++;
  crunchiness = max(10, crunchiness - 2);
  findPokemon("https://pokeapi.co/api/v2/pokemon/" + pokeID);
}
