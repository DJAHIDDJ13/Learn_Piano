/**
 * reads and handles the midi device and midi messages 
 * and also handles keyboard events and creates a piano event based on it
 */

let notes = [];
var piano_event;

window.addEventListener('piano', // handling piano events (midi or mouse or keyboard)
	function(e) {
		handlePianoEvent(e.detail.data);
	}, false
);

/* play the sound for the piano event */
function handlePianoEvent(m) {
    const [command, key, velocity] = m;
    if (((command === 155 || command === 149) || command === 144) && velocity != 0) {
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

/* dispatches a piano event with some log info when called by the midi device message */
function midiMessageHandler(m) {
	window.dispatchEvent(new CustomEvent('piano', {detail:{data: m.data, source: "midi"}}));
}

/* connects the midi device and sets up the Synth object(audiosynth.js) */
function setupMIDI() {
	navigator.requestMIDIAccess().then(
		function (m) {
			console.log("Initializing MIDI");
			m.inputs.forEach(function (entry) { // for all the midi device set the message handler as midiMessageHandler
				console.log(entry.name + " detected");
				entry.onmidimessage = midiMessageHandler;
			});
			Synth.setSampleRate(4000); // set the quality of the synthesized audio
		},
		function (err) {
			console.log('An error occured while trying to init midi: ' + err);
		}
	);
}

// keyboard midi simulator (needs bug fix when changing the octave while pressing)
window.onload = function () {
	setupMIDI();
	let notes_map = { // a look up table for the positions and codes of each keyboard key and piano midi code
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
	let octave_num = 4; // default octave number
	let octave_max = 7; // the maximum possible octave (the min is 0)
	let velocity = 50; // the default velocity
	let pressed = []; // to store the currently pressed
	
	document.addEventListener("keydown", function(e) {// the press event listener 
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
	
	document.addEventListener("keyup", function (e) {//the release event listener
		if(notes_map[e.keyCode] != undefined) {
			var d = [144, notes_map[e.keyCode] + 12 * (octave_num + 1), 0];
			window.dispatchEvent(new CustomEvent('piano', {detail:{data: d, source: "keyboard"}}));
			//~ handlePianoEvent({data:d});
		}
		pressed[e.keyCode] = false;
	});
}

