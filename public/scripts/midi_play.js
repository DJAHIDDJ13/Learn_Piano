//let piano = Synth.createInstrument('piano');
let note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function noteOn(key, velocity) {
	this.key = key;
	let note = Synth.generate('piano', note_names[key%12], key/12, 3);
	let audio = new Audio(note);
	audio.play();
	
	this.noteOff = function() {
		let fade = 50;
		let i = fade;
		let interv = setInterval(function() {
			i--;
			audio.volume = i * 1/fade;
			if(i <= 0) {
				clearInterval(interv);
			}
		}, 5);
	}
}

//~ let context = null;
//~ let playing_notes = [];
//~ let freq_lookup = [];

//~ function initAudioContext() {
	//~ for(let i=0; i<=112; i++) {
		//~ freq_lookup[i] = Math.pow(2, (i - 69) / 12) * 440;
	//~ }
	//~ context = new (window.AudioContext || window.webkitAudioContext)();
//~ }

//~ function noteOn(key, velocity) {
	//~ this.key = key;
	//~ this.stopped = false;
	//~ const freq = freq_lookup[key];
	
	//~ var attack = 20,
		//~ decay = 1000,
		//~ gain = context.createGain(),
		//~ osc = context.createOscillator();

	//~ gain.connect(context.destination);
	//~ gain.gain.setValueAtTime(0, context.currentTime);
	
	//~ gain.gain.linearRampToValueAtTime(1, context.currentTime + attack / 1000);
	//~ gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + decay / 1000);
	//~ gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.001);
	//~ osc.frequency.value = freq;
	//~ osc.connect(gain);
	//~ osc.start(0);
	
	
	//~ function stop_note() {
		//~ if(this.stopped) return;
		//~ osc.stop(0);
		//~ osc.disconnect(gain);
		//~ gain.disconnect(context.destination);
		//~ this.stopped = true;
	//~ }

	//~ setTimeout(function () {
		//~ stop_note();
	//~ }, decay+attack);

	//~ this.noteOff = function() {
		//~ stop_note();
	//~ }
//~ }



















//~ function connectToDevice(device) {
  //~ console.log('Connecting to device', device);
  //~ device.onmidimessage = function(m) {
    //~ const [command, key, velocity] = m.data;
    //~ if (command === 145) {
      //~ debugEl.innerText = 'KEY UP: ' + key;
      //~ noteOn(key);
    //~ } else if(command === 129) {
      //~ debugEl.innerText = 'KEY DOWN';
      //~ noteOff();
    //~ }
  //~ }
//~ }

//~ function replaceElements(inputs) {
  //~ while(list.firstChild) {
    //~ list.removeChild(list.firstChild)
  //~ }
  //~ const elements = inputs.map(e => {
        //~ console.log(e);
        //~ const el = document.createElement('li')
        //~ el.innerText = `${e.name} (${e.manufacturer})`;
        //~ el.addEventListener('click', connectToDevice.bind(null, e));
        //~ return el;
    //~ });

    //~ elements.forEach(e => list.appendChild(e));
//~ }

//~ navigator.requestMIDIAccess()
    //~ .then(function(access) {
      //~ console.log('access', access);
      //~ replaceElements(Array.from(access.inputs.values()));
      //~ access.onstatechange = function(e) {
        //~ replaceElements(Array.from(this.inputs.values()));
      //~ }

    //~ })


//~ // Below is keyboard emulation for C4-C5 q-i keys
//~ var emulatedKeys = {
  //~ q: 60,
  //~ w: 62,
  //~ e: 64,
  //~ r: 65,
  //~ t: 67,
  //~ y: 69,z
  //~ u: 71,
  //~ i: 72,
//~ }

//~ document.addEventListener('keydown', function(e) {
  //~ console.log(e);
  //~ if (emulatedKeys.hasOwnProperty(e.key)) {
    //~ noteOn(emulatedKeys[e.key]);
  //~ }
//~ });

//~ document.addEventListener('keyup', function(e) {
  //~ if (emulatedKeys.hasOwnProperty(e.key)) {
    //~ noteOff();
  //~ }
//~ });
