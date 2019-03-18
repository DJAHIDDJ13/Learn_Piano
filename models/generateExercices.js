var notesByDifficulty = [60, 62, 64, 65, 67, 48, 50 , 52, 53, 55, 69, 71, 57, 59, 61, 63, 66, 68, 70, 49, 51, 54, 56, 58];
var symbolTable = {
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

function getDifficulty(prevExercices) {
	var diffidx = 0;
	var time = 0;
	//~ var playeridx = ;
	//~ for(var i=0; i<prevExercices.notes.length, i++) {
		//~ while(preExercices.player[playeridx++] < i*30 && playeridx < prevExercices.player.length);
		//~ if() {
			
		//~ } else {
			
		//~ }
	//~ }
}

var generateExercice = function(prevExercices) {
	var notes = [];
	//~ if() {
		
	//~ }
	/* for testing */
	for(var i=0; i<30; i++)  {
		if(notes[i] == undefined) {
			notes[i] = [];
		}

		notes[i].push({
			sym: symbolTable.half,
			val: 48+i
		});
	}
	console.log(notes);
	return {notes: notes, len: 35, tempo: 60};
}
module.exports = generateExercice;
