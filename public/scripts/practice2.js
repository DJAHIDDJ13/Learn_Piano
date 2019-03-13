var pianoobj;
var pianoCanvas;

function setup() {
	pianoCanvas = createCanvas(1200, 300);
	pianoCanvas.parent("piano");
	background(255);
	pianoobj = new piano(1);
}

function draw() {
	background(255);
	stroke(0);

}
