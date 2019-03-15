/**
 * Plays the sound for the piano events
 */
let note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function noteOn(key, velocity) { // plays a single note with the audiosynth library
	this.key = key;
	let note = Synth.generate('piano', note_names[key%12], key/12, 3);
	let audio = new Audio(note); // generates a wav file
	audio.play();
	// the library doesnt have an option to stop the note midway
	// so I use this to stop the note, which is fading the volume of the Audio
	// object which is wav file 
	this.noteOff = function() { 
		let fade = 50; // in ms
		let i = fade;
		let interv = setInterval(function() { // i use setInterval to fade the note (to avoid sound clicks)
			i--;
			audio.volume = i * 1/fade;
			if(i <= 0) {
				clearInterval(interv);
			}
		}, 5);
	}
}
