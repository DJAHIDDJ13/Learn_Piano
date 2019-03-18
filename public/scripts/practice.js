/**
 * the main loop fir the exercice animation and also handles piano events
 * from the mouse, keyboard and the midi device
 */

var sol;
var pian;
var solfegeCanvas;
var p;
var idx = -8;
var pressedKey = 0;


function loadExercice() { // function to request the exercice with ajax
	$.ajax({
		url: '/course/exercice/getExercice',
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		type: "get",
		success: function(e) {
			console.log('received exercice from server');
			sol.loadExercice(JSON.parse(e));
		},
		error: function(e) {
			console.log(e);
		}
	});
}
/* load an exercice when the document is ready (JQuery syntax)*/
$(document).ready(function() {
	loadExercice();
});

/* this is a function used by the p5.js library to setup the initial values
 * used to draw */
function setup() {
	solfegeCanvas = createCanvas(1200, 600); // create an html canvas element
	solfegeCanvas.parent("solfege");
	
	background(255);
	sol = new solfege();
	pian = new piano();
}

/* this is a p5.js function. it is called 60 times a second for the animation */
function draw() {
	background(255);
	sol.show();
	translate(0, 350); // translate to draw the piano 
	pian.show();
}

/* to handle the mouse drag events*/
function mouseDragged() {
	if(mouseY > 350) {
		pian.updateShift(mouseX-pmouseX);
	}
}
/* toggles the value of a certain key after detecting which key was pressed 
 * by the mouse (PS. the function changes pian.active directly )*/
function toggleValue() {
	if(mouseY < 350) {
		return;
	}
	/* black keys detection (it is important that this is before the white keys detection) */
	var shifted = mouseX - pian.shift;

	if(mouseY <= 350+pian.blackKeyLen) {
		if(Math.abs(
			shifted - 
			Math.round(shifted/pian.whiteKeyWidth)*pian.whiteKeyWidth
		   ) < pian.blackKeyWidth/2) 
		{
			var black_idx = Math.floor((shifted+pian.blackKeyWidth)/pian.whiteKeyWidth);
			if(black_idx%7 != 0 && black_idx%7 != 4) {
				var active_idx = black_idx*2-1 - pian.blackLUT[black_idx] + pian.startOffset;
				pian.active[active_idx] = true;

				pressedKey = active_idx;
				window.dispatchEvent(new CustomEvent('piano', {detail:{data: [144, active_idx, 50], source: "keyboard"}}));
				return;
			}
		}
	}
	if(mouseY > solfegeCanvas.height) {
		return;
	}
	/* white keys detection */
	var white_idx = Math.floor(shifted/pian.whiteKeyWidth);
	var active_idx = white_idx*2 - pian.blackLUT[white_idx] + pian.startOffset;

	pressedKey = active_idx;
	pian.active[active_idx] = true;
	window.dispatchEvent(new CustomEvent('piano', {detail:{data: [144, active_idx, 50], source: "mouse"}}));
}

/* handles the mouse presses */
function mousePressed() {
	toggleValue();
}

/* handles the mouse releases */
function mouseReleased() {
	pian.active[pressedKey] = false;
	window.dispatchEvent(new CustomEvent('piano', {detail:{data: [144, pressedKey, 0], source: "mouse"}}));
}

// updating piano visual based on piano event (informs the solfege object of the piano events)
window.addEventListener('piano',function(e) { 
		pian.active[e.detail.data[1]] = e.detail.data[2] != 0;

		sol.update(e.detail.data[1], e.detail.data[2] == 0);
		if(e.detail.data[2]) { // e.detail.data[2] is the velocity if it is 0 then the event is a release
			if(!sol.playing) { 
				if(sol.tries > 0) { // if we are not in the first try load a new exercice
					loadExercice(); // load new exercice
				}
				sol.keyLog.score = sol.score; // log the score
				sol.play(60);
			}
		}
	}, false 
);

