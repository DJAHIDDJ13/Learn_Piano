class solfege {
	constructor(songInfo) {
		this.songInfo = songInfo;
		this.progress = 0;
		this.notenum = 0;
		this.playing = false;
		this.playInterval = 0;
		this.tries = 0;
		this.score = 0;
		this.tempo = 0;
		this.color = color(0);
		
		this.symbolTable = {
			Gclef: '\u{1D11E}',
			Fclef: '\u{1D122}',
			whole: '\u{1D15D}',
			half: '\u{1D15E}',
			quarter: '\u{1D15F}',
			eighth: '\u{1D160}',
			trem1: '\u{1D16A}',
			trem2: '\u{1D16B}',
			trem2: '\u{1D16C}',
			sharp: '\u{266F}'
		};
		
		this.durations = {
			'\u{1D15D}': 4,
			'\u{1D15E}': 2,
			'\u{1D15F}': 1,
			'\u{1D160}': 0.5
		};

		this.notes = [];
		this.songLen = 0;
		this.script = "Press any key to start the exercice";
		this.hints = [];
		this.seen = 0;

		this.blackLUT = [];
		var cumul = 0;
		for(var i=0; i<120; i++) {
			if((i)%12==1 || (i)%12==3 || (i)%12==6 || (i)%12==8 || (i)%12==10) {
				cumul++;
			}
			this.blackLUT[i] = cumul;
		}
		this.keyLog = {
			player: [],
			coursenum: 0,
			lecturenum: 0,
			content: {
				notes: this.notes
			} 
		};
	}

	loadExercice(exer) {
		this.keyLog.content.notes = exer.notes;
		this.notes = exer.notes;
		this.tempo = exer.tempo;
		this.songLen = exer.len;
	}

	updateScore(key, start, duration) {
		var nextNote = (start/30 << 0) + 1;
		var actualNote;
		while(!(actualNote = this.notes[nextNote++]) && nextNote < this.songLen);
		if(actualNote == undefined || this.seen == nextNote) {
			this.color = color(255,0,0);
			this.script = "Missed!";
			this.score = Math.max(0, this.score - 0.05);
			return;
		}
		this.seen = nextNote;

		var setNote = actualNote[0];
		for(var note in actualNote) {
			if(Math.abs(setNote.val - key) < Math.abs(note.val - key)) {
				setNote = note;
			}
		}
		actualNote = setNote;

		var actualKey = actualNote.val;
		var actualDuration = this.durations[actualNote.sym] * 5 * this.tempo / 60;

		var noteDifference = Math.abs(actualKey - key);
		var durationDifference = Math.round(Math.abs(actualDuration - duration));
		var startDifference = Math.abs((actualNote.pos)*30 - start);
		//~ this.script = '' + noteDifference + '/' + durationDifference + '/' + startDifference;
		var localScore = 0;
		if(!noteDifference) {
			localScore += (durationDifference)? 1/(1+durationDifference): 1;
			localScore += (startDifference)? 1/(startDifference+1): 1;
			this.score += localScore;
			if(localScore > 1.5) {
				this.script = "Amazing!";
			} else if(localScore > 0.8) {
				this.script = "Excellent";
			} else if(localScore > 0.5) {
				this.script = "Good";
			} else {
				this.script = "Decent";
			}
			this.color = color(0,255,0);			
		} else {
			this.color = color(255,0,0);
			this.script = "Missed!";
			this.score = Math.max(0, this.score - 0.05);
		}
		sol.logKeys({
			time: Math.abs(sol.progress),
			noteDifference: noteDifference,
			durationDifference: noteDifference,
			startDifference: startDifference
		});
	}

	update(key, isRelease) {
		if(!isRelease) {
			this.hints[key] = {
				time: this.progress,
				color: "green",
				val: key
			}
		} else {
			if(!this.hints[key]) return;
			this.updateScore(key, 
							 Math.abs(this.hints[key].time), 
							 this.hints[key].time - this.progress);
			this.hints[key] = 0;
		}
	}
	
	logKeys(logEntry) {
		if(this.playing) {
			this.keyLog.player.push(logEntry);
		}
	}
	
	play(tempo) {
		this.tempo = tempo;
		this.playing = true;
		this.tries ++;
		if(this.playInterval) {
			console.log("cant play twice");
			return;
		}
		this.playInterval = setInterval(function() {
			sol.progress -= 1;
			if(Math.abs(sol.progress) > sol.songLen*30) {
				sol.stop();
				sol.progress = 0;
			}
		}, (60000/30)/tempo);
	}
	
	stop() {
		clearInterval(this.playInterval);
		this.playInterval = 0;
		this.script = "Your score was " + Math.round(this.score*100)/100 + '/' + this.songLen;
		$.ajax({ // post results
			type: 'POST',
			url: '/course/exercice',
			data: JSON.stringify(sol.keyLog),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(data) {
				console.log("results sent to server successfully");
				sol.script = "Saved results!";
			},
			error: function(err) {
				console.log(err);
			}
		});
		this.keyLog.player = []; // resetting log
		this.playing = false;
	}
	
	show() {
		this.notenum = Math.abs(Math.floor(this.progress / 30));

		/* score text */
		push();
		push();
		textAlign(CENTER, CENTER);
		textSize(40);
		text(this.script, solfegeCanvas.width/2, 200);
		pop();

		/* show horizontal lines */
		strokeWeight(1);
		var paddingY = 10; // before and between
		var paddingX = 20;
		var spaceBetween = 20;
		var spacing = 10; // between lines in pixels
		/* for melody */
		for(var i=0; i<5; i++) {
			line(paddingX, i*spacing+paddingY, solfegeCanvas.width - paddingX, i*spacing+paddingY);
		}
		/* for bass*/
		for(var i=0; i<5; i++) {
			line(paddingX, (i+5)*spacing+spaceBetween, solfegeCanvas.width - paddingX, (i+5)*spacing+spaceBetween);
		}
		
		/* start and end vertical lines*/
		strokeWeight(4);
		line(paddingX, paddingY, paddingX, spaceBetween + spacing*9); // start
		line(solfegeCanvas.width - paddingX, paddingY, solfegeCanvas.width - paddingX, spaceBetween + spacing*9); // end

		/* melody and bass symbols */
		strokeWeight(1);
		var symbolTable = this.symbolTable;
		textSize(50);
		text(symbolTable.Gclef, paddingX+5, paddingY+spacing*3.5)
		text(symbolTable.Fclef, paddingX+5, spaceBetween+spacing*9)
		
		stroke(0,255,0);
		line(paddingX+80,paddingY,paddingX+80,spaceBetween + spacing*9);
		
		/* actual notes */
		stroke(0);
		translate(this.progress, 0);
		
		textSize(40);
		var noteSpacing = 30;
		var outLedgerWidth = 18;
		var notesPadding = 70;
		for(var i=this.progress; i<this.songLen; i++) {
			if(!this.notes[i]) {
				continue;
			}
			for(var note of this.notes[i]) {
				if(this.notenum == i) {
					stroke(0,255,0);
					fill(0, 255, 0);
				} else {
					stroke(0);
					fill(0);
				}
				note.pos = i;
				if(note.pos*noteSpacing + this.progress > solfegeCanvas.width-150) { /* outside the screen */
					continue;
				}
				if(note.pos*noteSpacing + this.progress < notesPadding-100) {
					continue;
				}
				var noteOff = 44 - note.val;
				noteOff += this.blackLUT[note.val];
				var isSharp = this.blackLUT[note.val] != this.blackLUT[note.val-1];
				push();
				translate(note.pos*noteSpacing + paddingX+notesPadding, 
						  paddingY+(spacing/2)*noteOff);
				var wtext = ((isSharp)? this.symbolTable.sharp: '');

				if((noteOff > 3 && noteOff < 10) || (noteOff > 16)) {
					text(note.sym, 0, spacing);
					if(wtext) {
						push();
						textSize(20);
						text(wtext, -6, spacing);
						pop();
					}
				} else {
					rotate(PI);
					text(note.sym, -20, -1);
					if(wtext) {
						push();
						textSize(20);
						text(wtext, -6, -1);
						pop();
					}
				}
				//~ if((noteOff > 7 || noteOff < -1) && Math.abs(noteOff)%2 == 1) {
					//~ strokeWeight(2);
					//~ line(0, spacing/2, outLedgerWidth, spacing/2);
				//~ }
				pop();
			}
		}
		/* draw hints */
		for(var i=0; i<120; i++) {
			stroke(this.color);
			fill(this.color);
			//~ translate(paddingX+notesPadding, 
					  //~ paddingY+(spacing/2)*(44-));
			if(this.hints[i]) {
				var noteOff = 46 - this.hints[i].val;
				noteOff += this.blackLUT[this.hints[i].val];
				var isSharp = this.blackLUT[this.hints[i].val] != this.blackLUT[this.hints[i].val-1];
				var wtext = ((isSharp)? this.symbolTable.sharp: '');

				text(this.symbolTable.whole, 93-this.progress,
				paddingY+(spacing/2)*noteOff);
				if(wtext) {
					push();
					textSize(20);
					text(wtext, 93-this.progress-8,
								paddingY+(spacing/2)*noteOff);
					pop();
				}
			}
		} 
		pop();
	}
}
