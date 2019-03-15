/**
 * Shows and manages the exercice and and the solfege graph
 * it also keeps a log of the key presses and the exercice received
 */

class solfege {
	constructor() {
		this.progress = 0; // the progress
		this.notenum = 0; // the current notenum
		this.playing = false; // boolean for the playing state
		this.playInterval = 0; // the interval of (setInterval) is store to be stopped by stop()
		this.tries = 0; // number of tries so far, for logging
		this.score = 0; // the current score
		this.tempo = 0; // the song tempo
		this.color = color(0); // the hint color
		 
		this.symbolTable = { // table of utf-8 chraracters of musical symbols
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
		
		this.durations = { // relative (to each other) durations of each note type
			'\u{1D15D}': 4,
			'\u{1D15E}': 2,
			'\u{1D15F}': 1,
			'\u{1D160}': 0.5
		};

		this.notes = []; // the notes to be played (to be filled by the server ajax req)
		this.songLen = 0; // the song len 
		this.script = "Press any key to start the exercice"; // script text
		this.hints = []; // to store the currently pressed keys for the hints
		this.seen = 0; // the current last seen note (to avoid a problem with scores) 
		// where the user can click multiple times on the same note and get a score for each click
		this.blackLUT = []; // Look up table, blackLUT[n] returns the number
		// of black notes from the beginning to n
		var cumul = 0; // temp variable to fill blackLUT
		for(var i=0; i<120; i++) { // filling the blackLUT
			if((i)%12==1 || (i)%12==3 || (i)%12==6 || (i)%12==8 || (i)%12==10) {
				cumul++;
			}
			this.blackLUT[i] = cumul;
		}
		this.keyLog = { // the key log to be sent to the server after the exercice
			player: [],
			coursenum: 0,
			level: 0,
			lecturenum: 0,
			content: {
				notes: this.notes
			}
		};
		this.note_names = ['DO', 'DO#', 'RE', 'RE#', 'MI', 'FA', 'FA#', 'SOL', 'SOL#', 'LA', 'LA#', 'SI'];

	}

	/* load the exercice to the this.note s and other info */
	loadExercice(exer) {
		this.keyLog.content.notes = exer.notes;
		this.keyLog.level = exer.level;
		this.notes = exer.notes;
		this.tempo = exer.tempo;
		this.songLen = exer.len;
	}
	/* calculate and update the score and the script and log */
	/* needs to be redone */
	updateScore(key, start, duration) {
		// predict the note meant to be played
		var nextNote = (start/30 << 0);
		var actualNote;
		while(!(actualNote = this.notes[nextNote++]) && nextNote < nextNote + 3);
		
		if(actualNote == undefined || this.seen == nextNote) {
			this.color = color(255,0,0);
			this.script = "Missed!";
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

		var localScore = 0;
		if(!noteDifference) {
			localScore += (durationDifference)? 1/(durationDifference+1): 1;
			localScore += (startDifference)? 1/(startDifference+1): 1;
			this.score ++;
			if(localScore > 1) {
				this.script = "Amazing!";
			} else if(localScore > 0.7) {
				this.script = "Excellent";
			} else if(localScore > 0.4) {
				this.script = "Good";
			} else {
				this.script = "Decent";
			}
			this.color = color(0,255,0);			
		} else {
			this.color = color(255,0,0);
			this.script = "Missed!";
		}
		sol.logKeys({
			time: Math.abs(sol.progress),
			noteDifference: noteDifference,
			durationDifference: noteDifference,
			startDifference: startDifference
		});
	}
	/* each time a piano event happens it is sent here to log and fill the this.hints */
	update(key, isRelease) {
		if(!isRelease) {
			this.hints[key] = {
				time: this.progress,
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
	
	/* adds one object to this.keyLog.player used to log the user key clicks */
	logKeys(logEntry) {
		if(this.playing) {
			this.keyLog.player.push(logEntry);
		}
	}
	
	/* start playing the song using setInterval */
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
	
	// stops the song and sends the exercice results to the server
	// and resets values
	stop() {
		this.keyLog.score = this.score;
		clearInterval(this.playInterval);
		$.ajax({ // post results
			type: 'POST',
			url: '/course/exercice',
			data: JSON.stringify(sol.keyLog),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(data) {
				console.log("results sent to server successfully");
			},
			error: function(err) {
				alert("an error has occured while sending your results");
				console.log(err);
			}
		});
		this.playInterval = 0;
		this.script = "You got " + Math.round(this.score*100)/100 + '!';
		this.keyLog.player = []; // resetting log
		this.playing = false;
	}
	
	/* the main function to show the solfege and hints*/
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
		for(var i=this.progress; i<this.songLen; i++) { // parsing the notes and drawing them
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
				var wtext = ((isSharp)? this.symbolTable.sharp: ''); // for the sharp symbol

				if((noteOff > 3 && noteOff < 10) || (noteOff > 16)) { // a normal note
					text(note.sym, 0, spacing);
					if(wtext) {
						push();
						textSize(20);
						text(wtext, -6, spacing);
						pop();
					}
				} else { // a rotated note
					rotate(PI);
					text(note.sym, -20, -1);
					if(wtext) {
						push();
						textSize(20);
						text(wtext, -6, -1);
						pop();
					}
				}
				//~ /* to draw the out ledgers*/
				if(((noteOff > 7 && noteOff < 10) || noteOff < -1 || (noteOff > 19) ) && Math.abs(noteOff)%2 == 1) {
					strokeWeight(2);
					line(0, spacing/2, outLedgerWidth, spacing/2);
				}
				pop();
			}
		}
		/* draw hints */
		var wroteNote = 0;
		for(var i=0; i<120; i++) {
			stroke(this.color);
			fill(this.color);
			if(this.hints[i]) {
				var noteOff = 46 - this.hints[i].val;
				noteOff += this.blackLUT[this.hints[i].val];
				var isSharp = this.blackLUT[this.hints[i].val] != this.blackLUT[this.hints[i].val-1];
				var wtext = ((isSharp)? this.symbolTable.sharp: '');
				if(!wroteNote && this.hints[i]) {
					wroteNote = 1;
					push();
					textSize(20);
					fill(0);
					stroke(0);
					text(this.note_names[this.hints[i].val % 12], 20-this.progress, 150);
					pop();
				}
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
