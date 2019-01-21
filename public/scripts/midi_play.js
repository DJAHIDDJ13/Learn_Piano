let context = null;

function initAudioContext() {
	context = new (window.AudioContext || window.webkitAudioContext)();
}

function noteOn(key, velocity) {
	console.log('IN ' + key);
	const freq = Math.pow(2, (key - 69) / 12) * 440;
	var attack = 100,
		decay = 500,
		gain = context.createGain(),
		osc = context.createOscillator();
	
	gain.connect(context.destination);
	gain.gain.setValueAtTime(0, context.currentTime);
	gain.gain.linearRampToValueAtTime(1, context.currentTime + attack / 1000);
	gain.gain.linearRampToValueAtTime(0, context.currentTime + decay / 1000);
	
	osc.frequency.value = Math.round(freq);
	osc.connect(gain);
	osc.start(0);
	
	setTimeout(function () {
		osc.stop(0);
		osc.disconnect(gain);
		gain.disconnect(context.destination);
	}, decay);
}

function noteOff(m) {
}





















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
