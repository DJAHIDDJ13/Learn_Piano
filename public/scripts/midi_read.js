
function midiMessageHandler(m) {
	//console.log(m.data);
    const [command, key, velocity] = m.data;
    if (command === 144 && velocity != 0) {
		noteOn(key, velocity);
    } else if (command == 144 && velocity == 0) {
		noteOff(key);
	}
}

function setupMIDI() {
	initAudioContext();
	navigator.requestMIDIAccess().then(
		function (m) {
			console.log("Initializing MIDI");
			m.inputs.forEach(function (entry) {
				console.log(entry.name + " detected");
				entry.onmidimessage = midiMessageHandler;
			});
		},
		function (err) {
			console.log('An error occured while trying to init midi: ' + err);
		}
	);
}

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
	let pressed;
	document.addEventListener("keydown", function(e) {
		if(pressed == e.keyCode) return;
		
		console.log(e.keyCode);
		if(e.keyCode == 87) {
			octave_num = Math.max(octave_num - 1, 0);	
		} else if(e.keyCode == 88) {
			octave_num = Math.min(octave_num + 1, octave_max);
		} else if(notes_map[e.keyCode] != undefined) {
			noteOn(notes_map[e.keyCode] + 12 * (octave_num+1), 1);
		}
		pressed = e.keyCode;
	});
	document.addEventListener("keyup", function (e) {
		pressed = 0;
	});
}

