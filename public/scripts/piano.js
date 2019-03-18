
class piano {
	constructor(notes) {
		this.notes = notes;
		this.shift = 0;
		this.active = [];
		for(var i=0; i<120; i++) {
			this.active[i] = false;
		}
		this.whiteKeyWidth = 60;
		this.whiteKeyLen = 249;
		this.blackKeyWidth = this.whiteKeyWidth*0.6;
		this.blackKeyLen = this.whiteKeyLen*0.6;
		
		this.blackLUT = [];
		var cumul = 0;
		for(var i=0; i<120; i++) {
			if((i-1)%7==3 || (i-1)%7==6) {
				cumul++;
			}
			this.blackLUT[i] = cumul;
		}
		
		this.startOffset = 17;
	}
	updateShift(delta) {
		this.shift = constrain(this.shift+delta, -56*this.whiteKeyWidth+1199, 0);
	}
	updateKeys(on, off) {
		for(var i of on) {
			this.active[i] = 1;
		}
		for(var i of off) {
			this.active[i] = 0;
		}
	}

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
