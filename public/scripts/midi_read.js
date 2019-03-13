let notes = [];
var piano_event;

window.addEventListener('piano', // handling piano events (midi or mouse or keyboard)
	function(e) {
		console.log(e.detail.data);
		handlePianoEvent(e.detail.data);
	}, false
);
function handlePianoEvent(m) {
    const [command, key, velocity] = m;

    if ((command === 155 || command === 144)&& velocity != 0) {
		notes.push(new noteOn(key, velocity));
    } else if (command == 155 && velocity == 0) {
		for(let i=0; i<notes.length; i++) {
			if(notes[i].key == key) {
				notes[i].noteOff();
				notes.splice(i, 1);
			}
		}
	}
}
function midiMessageHandler(m) {
	window.dispatchEvent(new CustomEvent('piano', {detail:{data: m.data, source: "midi"}}));
	//~ handlePianoEvent(m);
}

function setupMIDI() {
	navigator.requestMIDIAccess().then(
		function (m) {
			console.log("Initializing MIDI");
			m.inputs.forEach(function (entry) {
				console.log(entry.name + " detected");
				entry.onmidimessage = midiMessageHandler;
			});
			Synth.setSampleRate(44100);
		},
		function (err) {
			console.log('An error occured while trying to init midi: ' + err);
		}
	);
}

// keyboard midi simulator
window.onload = function () {
	setupMIDI();
	let notes_map = {
		81: 0,
		90: 1,
		83: 2,
		69: 3,
		68: 4,
		70: 5,
		84: 6,
		71: 7,
		89: 8,
		72: 9,
		85: 10,
		74: 11,
		75: 12,
		79: 13,
		76: 14,
		80: 15,
		77: 16
	};
	let octave_num = 4;
	let octave_max = 7;
	let velocity = 50;
	let pressed = [];
	
	document.addEventListener("keydown", function(e) {
		if(pressed[e.keyCode]) return;
		
		if(e.keyCode == 87) { // octave down
			octave_num = Math.max(octave_num - 1, 0);	
		} else if(e.keyCode == 88) { // octave up
			octave_num = Math.min(octave_num + 1, octave_max);
		} else if(e.keyCode == 67) { // velocity down
			velocity = Math.max(velocity - 10, 1);
		} else if(e.keyCode == 86) { // velocity up
			velocity = Math.min(velocity + 10, 128);
		} else if(notes_map[e.keyCode] != undefined) {
			var d = [144, notes_map[e.keyCode] + 12 * (octave_num+1), velocity];
			window.dispatchEvent(new CustomEvent('piano', {detail:{data: d, source: "keyboard"}}));
			//~ handlePianoEvent({data:d});
		}

		pressed[e.keyCode] = true;
	});
	
	document.addEventListener("keyup", function (e) {
		if(notes_map[e.keyCode] != undefined) {
			var d = [144, notes_map[e.keyCode] + 12 * (octave_num + 1), 0];
			window.dispatchEvent(new CustomEvent('piano', {detail:{data: d, source: "keyboard"}}));
			//~ handlePianoEvent({data:d});
		}
		pressed[e.keyCode] = false;
	});
}

