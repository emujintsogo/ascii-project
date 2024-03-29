const canvas = document.getElementById("canvas1"); 
const context = canvas.getContext('2d');
let cellSize;

const image = new Image();
image.onload = function() {
    initialize();
}

let inputFile = document.getElementById("inputFile");

inputFile.onchange = function() {
    const newImage = new Image();
    newImage.src = URL.createObjectURL(inputFile.files[0]);
    newImage.onload = function() {
        image.src = newImage.src;
        initialize();
    }
} 

const slider = document.getElementById("y1-slider");
const sliderLabel = document.getElementById("y1-sliderLabel");
const fontSize = document.getElementById("fontSize");

slider.addEventListener("change", handleControls);
fontSize.addEventListener("change", handleControls);

class Cell {
    constructor(x, y, symbol, color) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    } 

    draw(context) {
        context.fillStyle = this.color;
        context.fillText(this.symbol, this.x, this.y);
    }
}

class AsciiEffect {
    imageCellArray = [];
    #pixels = [];
    #context;
    #width;
    #height; 

    constructor(context, width, height) {
        this.#context = context; 
        this.#width = width;
        this.#height = height;
        this.#context.drawImage(image, 0, 0, this.#width, this.#height);
        this.#pixels = this.#context.getImageData(0, 0, this.#width, this.#height);
    }

    #convertToSymbol(x) {
        if(x > 240) return "@"; 
        else if(x > 230) return "#";
        else if(x > 220) return "W";
        else if(x > 210) return "$";
        else if(x > 200) return "9";
        else if(x > 190) return "8";
        else if(x > 180) return "7";
        else if(x > 170) return "6";
        else if(x > 160) return "5";
        else if(x > 150) return "4";
        else if(x > 140) return "3";
        else if(x > 130) return "2";
        else if(x > 120) return "1";
        else if(x > 110) return "0";
        else if(x > 100) return "?";
        else if(x > 90) return "!";
        else if(x > 80) return "a";
        else if(x > 70) return "b";
        else if(x > 60) return "c";
        else if(x > 50) return ";";
        else if(x > 40) return ":";
        else if(x > 30) return "+";
        else if(x > 20) return "=";
        else if(x > 10) return "-";
        else if(x > 5) return "_";
        else return "";
    }

    #scanImage(fontSize) {
        cellSize = fontSize;
        this.imageCellArray = [];
        for(let y = 0; y < this.#height; y += cellSize) {
            for(let x = 0; x < this.#width; x += cellSize) {
                const posX = x * 4; 
                const posY = y * 4;
                const pos = (posY * this.#width) + posX;

                const red = this.#pixels.data[pos];
                const green = this.#pixels.data[pos + 1];
                const blue = this.#pixels.data[pos + 2];
                const averageColorValue = (red+green+blue)/3;
                const color = "rgb(" + red + " ," + green + " ," + blue + ")";
                const symbol = this.#convertToSymbol(averageColorValue);
                this.imageCellArray.push(new Cell(x, y, symbol, color));
            }
        }
    }

    #drawAscii(lines) {
    this.#context.drawImage(image, 0, 0, canvas.width, canvas.height);
    for(let y=0; y<=lines;y++) { 
        this.#context.clearRect(0, y*cellSize - cellSize, this.#width, cellSize);
        for(let x = Math.floor(y*this.#width/cellSize);x<Math.floor(y*this.#width/cellSize + this.#width/cellSize);x++) {              
            this.imageCellArray[x].draw(this.#context);
            }
        }
    }
    
    draw(lines, fontSize) {
        this.#scanImage(fontSize);
        this.#drawAscii(lines); 
    } 
}

let effect;

function handleControls() {
    const selectedFontSize = parseInt(fontSize.value);
    slider.max = Math.floor(image.height/selectedFontSize) + 1;
    context.font = selectedFontSize + "px Verdana";
    sliderLabel.innerHTML = "Slider: " + slider.value;
    effect.draw(parseInt(slider.value), selectedFontSize);
}

function initialize() {
    canvas.width = image.width;
    canvas.height = image.height;
    effect = new AsciiEffect(context, image.width, image.height);
    handleControls();
}
