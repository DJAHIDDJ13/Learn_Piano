class solfege {
	constructor(songInfo) {
		this.songInfo = songInfo;
		this.progress = 0;
		this.symbolTable = {
			Gclef: '\u{1D11E}',
			Fclef: '\u{1D122}',
			whole: '\u{1D15D}',
			half: '\u{1D15E}',
			quarter: '\u{1D15F}',
			eighth: '\u{1D160}',
			trem1: '\u{1D16A}',
			trem2: '\u{1D16B}',
			trem2: '\u{1D16C}'
		};
		//~ this.Gnotes = Gnotes;
		//~ this.Fnotes = Fnotes;
		this.Gnotes = [
			{
				sym: this.symbolTable.whole,
				pos: 0,
				val: 0
			},
			{
				sym: this.symbolTable.half,
				pos: 1,
				val: 0
			},
			{
				sym: this.symbolTable.quarter,
				pos: 2,
				val: 0
			},
			{
				sym: this.symbolTable.whole,
				pos: 3,
				val: 9
			},
		]
		this.Fnotes = [
			{
				sym: this.symbolTable.whole,
				pos: 0,
				val: 0
			},
			{
				sym: this.symbolTable.half,
				pos: 1,
				val: 0
			},
			{
				sym: this.symbolTable.quarter,
				pos: 2,
				val: 0
			},
			{
				sym: this.symbolTable.eighth,
				pos: 3,
				val: 2
			},
		]
	}
	
	update(incr) {
		this.progress += incr;
	}
	
	show() {
		push();
		/* show horizontal lines */
		strokeWeight(1);
		var paddingY = 10; // before and between
		var paddingX = 20;
		var spaceBetween = 50;
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
		
		/* actual notes */
		translate(this.progress, 0);
		
		textSize(40);
		var noteSpacing = 20;
		var outLedgerWidth = 18;
		var notesPadding = 70;
		/* G notes */
		for(let note of this.Gnotes) {
			if(note.pos*noteSpacing > paddingY+solfegeCanvas.width) { /* outside the screen */
				break;
			}
			push();
			translate(note.pos*noteSpacing + paddingX+notesPadding, paddingY+(spacing/2)*note.val);
			if(note.val > 3) {
				text(note.sym, 0, spacing);
			} else {
				rotate(PI);
				text(note.sym, -20, -1);				
			}
			if((note.val > 7 || note.val < -1) && Math.abs(note.val)%2 == 1) {
				strokeWeight(2);
				line(0, spacing/2, outLedgerWidth, spacing/2);
			}
			pop();
		}
		/* F notes */
		for(let note of this.Fnotes) {
			if(note.pos*noteSpacing > paddingY+solfegeCanvas.width) { /* outside the screen */
				break;
			}
			push();
			translate(note.pos*noteSpacing + paddingX+notesPadding, paddingY+4*spacing+spaceBetween+(spacing/2)*note.val);
			if(note.val > 3) {
				text(note.sym, 0, spacing);
			} else {
				rotate(PI);
				text(note.sym, -20, -1);
			}
			if((note.val > 7 || note.val < -1) && Math.abs(note.val)%2 == 1) {
				strokeWeight(2);
				line(0, spacing/2, outLedgerWidth, spacing/2);
			}
			pop();
		}
		pop();
	}
}
