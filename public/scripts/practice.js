var sol;
var pian;
var solfegeCanvas;
var p;
var idx = -8;
var pressedKey = 0;

function loadExercice() {
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
$(document).ready(function() {
	loadExercice();
});

function setup() {
	solfegeCanvas = createCanvas(1200, 600);
	solfegeCanvas.parent("solfege");
	
	background(255);
	sol = new solfege(1);
	pian = new piano(1);
}

function draw() {
	background(255);
	sol.show();
	//~ if(sol.progress < -60 || sol.progress > 1000) {
		//~ idx *= -1;
	//~ }
	//~ sol.show();
	//~ sol.update(idx);
	//~ sol.update(-1, 0,0);
	translate(0, 350);
	pian.show();
}

function mouseDragged() {
	if(mouseY > 350) {
		pian.updateShift(mouseX-pmouseX);
	}
}
function toggleValue() {
	if(mouseY < 350) {
		return;
	}
	/* black detection */
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
				//~ console.log(active_idx);
				pressedKey = active_idx;
				window.dispatchEvent(new CustomEvent('piano', {detail:{data: [144, active_idx, 50], source: "keyboard"}}));
				return;
			}
		}
	}
	if(mouseY > solfegeCanvas.height) {
		return;
	}
	/* white detection */
	var white_idx = Math.floor(shifted/pian.whiteKeyWidth);
	var active_idx = white_idx*2 - pian.blackLUT[white_idx] + pian.startOffset;

	pressedKey = active_idx;
	pian.active[active_idx] = true;
	window.dispatchEvent(new CustomEvent('piano', {detail:{data: [144, active_idx, 50], source: "mouse"}}));
}

function mousePressed() {
	toggleValue();
}

function mouseReleased() {
	pian.active[pressedKey] = false;
	window.dispatchEvent(new CustomEvent('piano', {detail:{data: [144, pressedKey, 0], source: "mouse"}}));
}

window.addEventListener('piano',function(e) { // updating piano visual based on piano event
		pian.active[e.detail.data[1]] = e.detail.data[2] != 0;

		sol.update(e.detail.data[1], e.detail.data[2] == 0);
		if(e.detail.data[2]) {
			if(!sol.playing) {
				if(sol.tries > 0) {
					loadExercice(); // load new exercice
				}
				sol.keyLog.score = sol.score;
				sol.play(60);
			}
		}
	}, false 
);

