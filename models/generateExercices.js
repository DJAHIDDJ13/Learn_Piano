/**
 * Generates exercices based on user info and previous exercices
 * P.S. for now all it does is check if the user's last score was 
 * more than 5, and increases the level of the difficulty of the level
 * sent, these levels are hard coded.
 */

//~ var notesByDifficulty = [60, 62, 64, 65, 67, 48, 50 , 52, 53, 55, 69, 71, 57, 59, 61, 63, 66, 68, 70, 49, 51, 54, 56, 58];
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

var testSongs = 
[ // exercices pour les tests
	{ // test avec la note FA seule
		tempo: 60,
		len: 40,
		level: 0,
		notes: [
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,
			0,
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			[{
				sym: symbolTable.whole,
				val: 60
			}]			
		]
	},
	{ // test avec FA, SOL, LA, SI, DO
		tempo: 60,
		len: 30,
		level: 1,
		notes:[
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 62
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 64
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 65
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 67
			}],
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 67
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 65
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 64
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 62
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			}]
		]
	},
	{ // test avec avec bass
		len: 30,
		tempo: 60,
		level: 2,
		notes: [
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 48
			}],
			0,
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 48
			}],
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 48
			}],
			0,
			0,
			0,
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 48
			}],
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			[{
				sym: symbolTable.whole,
				val: 48
			}]			
		]
	},
	{ // halfs quarters and eigths
		len: 30,
		tempo: 60,
		level: 3,
		notes:[
			0,0,
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,0,
			[{
				sym: symbolTable.half,
				val: 60
			}],
			0,0,
			[{
				sym: symbolTable.quarter,
				val: 60
			}],
			0,0,
			[{
				sym: symbolTable.eighth,
				val: 60
			}],
			0,0,
			0,0,
			[{
				sym: symbolTable.whole,
				val: 60
			}],
			0,0,
			[{
				sym: symbolTable.half,
				val: 60
			}],
			0,0,
			[{
				sym: symbolTable.quarter,
				val: 60
			}],
			0,0,
			[{
				sym: symbolTable.eighth,
				val: 60
			}],
			0,0
		]
	},
	{ // chords
		len: 30,
		tempo: 60,
		level: 4,
		notes:[
			0,0,
			[{
				sym: symbolTable.whole,
				val: 60
			},
			{
				sym: symbolTable.whole,
				val: 64		
			},
			{
				sym: symbolTable.whole,
				val: 67
			}],
			0,0,
			[{
				sym: symbolTable.whole,
				val: 60
			},
			{
				sym: symbolTable.whole,
				val: 64		
			},
			{
				sym: symbolTable.whole,
				val: 67
			}],
			0,0,
			[{
				sym: symbolTable.whole,
				val: 60
			},
			{
				sym: symbolTable.whole,
				val: 64		
			},
			{
				sym: symbolTable.whole,
				val: 67
			}],
			0,0,
			[{
				sym: symbolTable.whole,
				val: 60
			},
			{
				sym: symbolTable.whole,
				val: 64		
			},
			{
				sym: symbolTable.whole,
				val: 67
			}],
			0,0,
			0,0,
			[{
				sym: symbolTable.whole,
				val: 60
			},
			{
				sym: symbolTable.whole,
				val: 64		
			},
			{
				sym: symbolTable.whole,
				val: 67
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			},
			{
				sym: symbolTable.whole,
				val: 64		
			},
			{
				sym: symbolTable.whole,
				val: 67
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			},
			{
				sym: symbolTable.whole,
				val: 64		
			},
			{
				sym: symbolTable.whole,
				val: 67
			}],
			0,
			[{
				sym: symbolTable.whole,
				val: 60
			},
			{
				sym: symbolTable.whole,
				val: 64		
			},
			{
				sym: symbolTable.whole,
				val: 67
			}],
			0,0
		]
	}
]

var generateExercice = function(prevExercices) {
	var lastExercice = prevExercices[prevExercices.length-1];
	if(lastExercice == undefined) {
		return testSongs[0];
	}
	var lastLevel = lastExercice.level;
	var diff = lastLevel;

	if(lastExercice.score > 5) {
		diff = (diff+1) % 5;
	}
	return testSongs[diff];
}
module.exports = generateExercice;
