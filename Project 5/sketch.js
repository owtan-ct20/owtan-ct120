let waterLevel;
let tideUrl;
let tideData;
let vid;

function preload() {
  tideUrl =
    "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_level&station=9413450&date=latest&datum=STND&units=metric&time_zone=gmt&format=json";

  tideData = loadJSON(tideUrl);
}

function setup() {
  createCanvas(490, 360);
  
  vid = createVideo(['https://cdn.discordapp.com/attachments/1318721669325389824/1511384772373643334/monterey_bay.mp4?ex=6a204241&is=6a1ef0c1&hm=3fcb995b3ad7ebaeea5c3780d61a5026853fd433f5e44399ef38a913d6012e57&']);
  //vid.play()
  vid.hide()
  vid.loop()
  vid.position(0,0);

  waterLevel = parseFloat(tideData.data[0].v);
  //waterLevel = 6

  console.log("Water level:", waterLevel);
  
  
}

function draw() {
  background(220);
  image(vid, 0, 0, width, height);
  
  if(waterLevel >=0){
    fill(10, 40, 90);
    rect(0, height-waterLevel*height/8, width, waterLevel*height/8, )
  }
}
