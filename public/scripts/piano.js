/**
 * handles the piano animation and events 
 */
class piano {
	constructor() {
		this.shift = 0; // the shift from the the start (after dragging from the start position)
		this.active = []; // an array of the currently active keys
		for(var i=0; i<120; i++) {// init
			this.active[i] = false;
		}
		this.whiteKeyWidth = 60; // the width of the white keys (when drawing)
		this.whiteKeyLen = 249; // the length of the white keys
		this.blackKeyWidth = this.whiteKeyWidth*0.6; // the width of the black keys
		this.blackKeyLen = this.whiteKeyLen*0.6; // the length of the black keys
		
		this.blackLUT = []; // black look up table 
		var cumul = 0;
		for(var i=0; i<120; i++) {
			if((i-1)%7==3 || (i-1)%7==6) {
				cumul++;
			}
			this.blackLUT[i] = cumul;
		}
		
		this.startOffset = 17; // the offset of our virtual piano from the start 
		// meaning the first key from the left has a midi code 17
	}
	/* update the shift, called from mouseDragged */
	updateShift(delta) {
		this.shift = constrain(this.shift+delta, -56*this.whiteKeyWidth+1199, 0);
	}
	
	/* update the keys on is an array of the new active keys whereas off is and array
	 * of the new disactivated keys */
	updateKeys(on, off) {
		for(var i of on) {
			this.active[i] = 1;
		}
		for(var i of off) {
			this.active[i] = 0;
		}
	}

	/* main function to show the piano */
	show() {
		translate(this.shift, 0);
		/* white keys */
		stroke(0);
		fill(255);
		var whiteKeyWidth = this.whiteKeyWidth;
		var whiteKeyLen = 249;
		for(var i=0; i<56; i++) {
			if(this.active[i*2-this.blackLUT[i]+this.startOffset]) {
				fill(255, 0, 0);
			} else {
				fill(255);
			}
			rect(i*whiteKeyWidth, 0, whiteKeyWidth, whiteKeyLen);
		}
		/* black keys */
		fill(0);
		var blackKeyLen = this.blackKeyLen;
		var blackKeyWidth = this.blackKeyWidth;
		for(var i=0; i<56; i++) {
			if(i%7 != 3 && i%7 != 6) {
				if(this.active[(i+1)*2-1-this.blackLUT[i]+this.startOffset]) {
					fill(255, 0, 0);
				} else {
					fill(0);
				}

				rect(i*whiteKeyWidth+whiteKeyWidth-blackKeyWidth/2, 0, blackKeyWidth, blackKeyLen);
			}
		}
		fill(0);
	}
}
