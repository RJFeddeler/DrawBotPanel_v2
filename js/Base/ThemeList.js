'use strict';

class ThemeList {
	constructor() {}

	static get themeList() {
		return [
			{		// DEFAULT
				name: 				'Default',
				border: 			'#0288d1',
				panel: 				'#0288d1',
				well: 				'#ffffff',
				backgroundBase: 	'#212121',
				backgroundPattern: 	'#0288d1',
				textPrimary: 		'#ffffff',
				textSecondary: 		'#212121',
				buttons:
				[
					'#ff5722',
					'#00c853',
					'#d500f9'
				]
			},

			{		// AILOVE
				name: 				'AILOVE',
				border: 			'#78244c',
				panel: 				'#895061',
				well: 				'#ffffff',
				backgroundBase: 	'#2d4159',
				backgroundPattern: 	'#895061',
				textPrimary: 		'#2d4159',
				textSecondary: 		'#78244c',
				buttons:
				[
					'#59253a',
					'#0677a1',
					'#78244c'
				]
			},

			{		// ColorHunt
				name: 				'ColorHunt',
				border: 			'#393e46',
				panel: 				'#00adb5',
				well: 				'#eeeeee',
				backgroundBase: 	'#eeeeee',
				backgroundPattern: 	'#222831',
				textPrimary: 		'#eeeeee',
				textSecondary: 		'#222831',
				buttons:
				[
					'#393e46',
					'#00adb5',
					'#eeeeee'
				]
			},

			{		// Bordel Studio
				name: 				'BordelStudio',
				border: 			'#557a95',
				panel: 				'#557a95',
				well: 				'#7395ae',
				backgroundBase: 	'#5d5c61',
				backgroundPattern: 	'#557a95',	
				textPrimary: 		'#5d5c61',
				textSecondary: 		'#eeeeee',
				buttons:
				[
					'#7395ae',
					'#b1a296',
					'#557a95'
				]
			},

			{		// Bryan James
				name: 				'BryanJames',
				border: 			'#950740',
				panel: 				'#950740',
				well: 				'#4e4e50',
				backgroundBase: 	'#1a1a1d',
				backgroundPattern: 	'#c3073f',	
				textPrimary: 		'#1a1a1d',
				textSecondary: 		'#4e4e50',
				buttons:
				[
					'#6f2232',
					'#950740',
					'#c3073f'
				]
			},

			{		// Anton & Irene
				name: 				'Anton&Irene',
				border: 			'#afd275',
				panel: 				'#c2cad0',
				well: 				'#c2cad0',
				backgroundBase: 	'#7e685a',
				backgroundPattern: 	'#c2b9b0',	
				textPrimary: 		'#7e685a',
				textSecondary: 		'#c2b9b0',
				buttons:
				[
					'#e7717d',
					'#c2b9b0',
					'#afd275'
				]
			},

			{		// Bert
				name: 				'Bert',
				border: 			'#45a29e',
				panel: 				'#c5c6c7',
				well: 				'#c5c6c7',
				backgroundBase: 	'#66fcf1',
				backgroundPattern: 	'#1f2833',	
				textPrimary: 		'#66fcf1',
				textSecondary: 		'#c5c6c7',
				buttons:
				[
					'#c5c6c7',
					'#45a29e',
					'#1f2833'
				]
			},

			{		// Epic
				name: 				'Epic',
				border: 			'#edc7b7',
				panel: 				'#bab2b5',
				well: 				'#eee2dc',
				backgroundBase: 	'#123c69',
				backgroundPattern: 	'#ac3b61',	
				textPrimary: 		'#123c69',
				textSecondary: 		'#ac3b61',
				buttons:
				[
					'#123c69',
					'#eee2dc',
					'#ac3b61'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 1',
				border: 			'#74838C',
				panel: 				'#736A62',
				well: 				'#26201B',
				backgroundBase: 	'#40372F',
				backgroundPattern: 	'#BFB5B4',	
				textPrimary: 		'#BFB5B4',
				textSecondary: 		'#BFB5B4',
				buttons:
				[
					'#BFB5B4'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 2',
				border: 			'#000000',
				panel: 				'#F13939',
				well: 				'#800000',
				backgroundBase: 	'#C00F15',
				backgroundPattern: 	'#FF0000',	
				textPrimary: 		'#FF0000',
				textSecondary: 		'#FF0000',
				buttons:
				[
					'#FF0000'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 3',
				border: 			'#1D1D1D',
				panel: 				'#F6E5D5',
				well: 				'#DCBBA2',
				backgroundBase: 	'#8F6750',
				backgroundPattern: 	'#270B01',	
				textPrimary: 		'#270B01',
				textSecondary: 		'#270B01',
				buttons:
				[
					'#270B01'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 4',
				border: 			'#2D2D2D',
				panel: 				'#C5D961',
				well: 				'#333333',
				backgroundBase: 	'#F2F2F2',
				backgroundPattern: 	'#CDD6CD',	
				textPrimary: 		'#CDD6CD',
				textSecondary: 		'#CDD6CD',
				buttons:
				[
					'#CDD6CD'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 5',
				border: 			'#677781',
				panel: 				'#F2F2F2',
				well: 				'#595247',
				backgroundBase: 	'#A69F94',
				backgroundPattern: 	'#F1D8B6',	
				textPrimary: 		'#F1D8B6',
				textSecondary: 		'#F1D8B6',
				buttons:
				[
					'#F1D8B6'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 6',
				border: 			'#5C4B51',
				panel: 				'#8CBEB2',
				well: 				'#F2EBBF',
				backgroundBase: 	'#F3B562',
				backgroundPattern: 	'#F06060',	
				textPrimary: 		'#F06060',
				textSecondary: 		'#F06060',
				buttons:
				[
					'#F06060'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 7',
				border: 			'#FFFFFF',
				panel: 				'#957FB1',
				well: 				'#AF867F',
				backgroundBase: 	'#9CA8AC',
				backgroundPattern: 	'#AAB4B4',	
				textPrimary: 		'#AAB4B4',
				textSecondary: 		'#AAB4B4',
				buttons:
				[
					'#AAB4B4'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 8',
				border: 			'#2E2822',
				panel: 				'#86B1D9',
				well: 				'#98D2FB',
				backgroundBase: 	'#B5C3CB',
				backgroundPattern: 	'#6B5A53',	
				textPrimary: 		'#6B5A53',
				textSecondary: 		'#6B5A53',
				buttons:
				[
					'#6B5A53'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 9',
				border: 			'#7B8783',
				panel: 				'#829D7C',
				well: 				'#434247',
				backgroundBase: 	'#B0C75B',
				backgroundPattern: 	'#B5B3B4',	
				textPrimary: 		'#B5B3B4',
				textSecondary: 		'#B5B3B4',
				buttons:
				[
					'#B5B3B4'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 10',
				border: 			'#686D8F',
				panel: 				'#AFC5DC',
				well: 				'#FAD4A2',
				backgroundBase: 	'#D8AA94',
				backgroundPattern: 	'#D98684',	
				textPrimary: 		'#D98684',
				textSecondary: 		'#D98684',
				buttons:
				[
					'#D98684'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 11',
				border: 			'#222222',
				panel: 				'#39455F',
				well: 				'#28ADC5',
				backgroundBase: 	'#CC7F5D',
				backgroundPattern: 	'#F83E1A',	
				textPrimary: 		'#F83E1A',
				textSecondary: 		'#F83E1A',
				buttons:
				[
					'#F83E1A'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 12',
				border: 			'#00A3FF',
				panel: 				'#353E48',
				well: 				'#556878',
				backgroundBase: 	'#243445',
				backgroundPattern: 	'#0F0A06',	
				textPrimary: 		'#0F0A06',
				textSecondary: 		'#0F0A06',
				buttons:
				[
					'#0F0A06'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 13',
				border: 			'#CEE8F2',
				panel: 				'#648C51',
				well: 				'#9DD973',
				backgroundBase: 	'#B4D99A',
				backgroundPattern: 	'#59462F',	
				textPrimary: 		'#59462F',
				textSecondary: 		'#59462F',
				buttons:
				[
					'#59462F'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 14',
				border: 			'#EDF4FB',
				panel: 				'#4A8FE3',
				well: 				'#71A9E9',
				backgroundBase: 	'#96BFEF',
				backgroundPattern: 	'#BDD6F4',	
				textPrimary: 		'#BDD6F4',
				textSecondary: 		'#BDD6F4',
				buttons:
				[
					'#BDD6F4'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 15',
				border: 			'#455B73',
				panel: 				'#546F8C',
				well: 				'#6383A6',
				backgroundBase: 	'#A7CC5C',
				backgroundPattern: 	'#92B250',	
				textPrimary: 		'#92B250',
				textSecondary: 		'#92B250',
				buttons:
				[
					'#92B250'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 16',
				border: 			'#68808B',
				panel: 				'#F5F4F2',
				well: 				'#BDB4A4',
				backgroundBase: 	'#3F3533',
				backgroundPattern: 	'#706765',	
				textPrimary: 		'#706765',
				textSecondary: 		'#706765',
				buttons:
				[
					'#706765'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 17',
				border: 			'#00060A',
				panel: 				'#0A1528',
				well: 				'#1A3457',
				backgroundBase: 	'#020A17',
				backgroundPattern: 	'#000613',	
				textPrimary: 		'#000613',
				textSecondary: 		'#000613',
				buttons:
				[
					'#000613'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 18',
				border: 			'#DA2536',
				panel: 				'#EF525B',
				well: 				'#EAE7D6',
				backgroundBase: 	'#24C2CB',
				backgroundPattern: 	'#082E41',	
				textPrimary: 		'#082E41',
				textSecondary: 		'#082E41',
				buttons:
				[
					'#082E41'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 19',
				border: 			'#EF0C1A',
				panel: 				'#F0F1F4',
				well: 				'#171E26',
				backgroundBase: 	'#424D58',
				backgroundPattern: 	'#6F7E8C',	
				textPrimary: 		'#6F7E8C',
				textSecondary: 		'#6F7E8C',
				buttons:
				[
					'#6F7E8C'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 20',
				border: 			'#F79E6B',
				panel: 				'#F7CD82',
				well: 				'#5B584F',
				backgroundBase: 	'#92A78C',
				backgroundPattern: 	'#E0D5AD',	
				textPrimary: 		'#E0D5AD',
				textSecondary: 		'#E0D5AD',
				buttons:
				[
					'#E0D5AD'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 21',
				border: 			'#517B8B',
				panel: 				'#B1CFDA',
				well: 				'#CFE5F2',
				backgroundBase: 	'#3F4140',
				backgroundPattern: 	'#A58D72',	
				textPrimary: 		'#A58D72',
				textSecondary: 		'#A58D72',
				buttons:
				[
					'#A58D72'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 22',
				border: 			'#192B38',
				panel: 				'#22424B',
				well: 				'#2E5458',
				backgroundBase: 	'#4E7367',
				backgroundPattern: 	'#7FA68C',	
				textPrimary: 		'#7FA68C',
				textSecondary: 		'#7FA68C',
				buttons:
				[
					'#7FA68C'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 23',
				border: 			'#000000',
				panel: 				'#202020',
				well: 				'#404040',
				backgroundBase: 	'#606060',
				backgroundPattern: 	'#808080',	
				textPrimary: 		'#808080',
				textSecondary: 		'#808080',
				buttons:
				[
					'#808080'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 24',
				border: 			'#BE4248',
				panel: 				'#21374B',
				well: 				'#586473',
				backgroundBase: 	'#DABF9A',
				backgroundPattern: 	'#4A89AA',	
				textPrimary: 		'#4A89AA',
				textSecondary: 		'#4A89AA',
				buttons:
				[
					'#4A89AA'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 25',
				border: 			'#3636BE',
				panel: 				'#2D85E5',
				well: 				'#03D366',
				backgroundBase: 	'#FCFF4B',
				backgroundPattern: 	'#F4553B',	
				textPrimary: 		'#F4553B',
				textSecondary: 		'#F4553B',
				buttons:
				[
					'#F4553B'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 26',
				border: 			'#56B9D0',
				panel: 				'#FEFEFE',
				well: 				'#FBBA42',
				backgroundBase: 	'#F24C27',
				backgroundPattern: 	'#3B3F42',	
				textPrimary: 		'#3B3F42',
				textSecondary: 		'#3B3F42',
				buttons:
				[
					'#3B3F42'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 27',
				border: 			'#404040',
				panel: 				'#5C5C5C',
				well: 				'#E91E63',
				backgroundBase: 	'#00BCD4',
				backgroundPattern: 	'#F8BBD0',	
				textPrimary: 		'#F8BBD0',
				textSecondary: 		'#F8BBD0',
				buttons:
				[
					'#F8BBD0'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 28',
				border: 			'#C73496',
				panel: 				'#0083AE',
				well: 				'#EDAC19',
				backgroundBase: 	'#ED1604',
				backgroundPattern: 	'#04A787',	
				textPrimary: 		'#04A787',
				textSecondary: 		'#04A787',
				buttons:
				[
					'#04A787'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 29',
				border: 			'#0A0A0D',
				panel: 				'#F4C803',
				well: 				'#F59E06',
				backgroundBase: 	'#F58906',
				backgroundPattern: 	'#F47204',	
				textPrimary: 		'#F47204',
				textSecondary: 		'#F47204',
				buttons:
				[
					'#F47204'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 30',
				border: 			'#06E7FF',
				panel: 				'#BC1FE8',
				well: 				'#FF8201',
				backgroundBase: 	'#72E81D',
				backgroundPattern: 	'#159EFF',	
				textPrimary: 		'#159EFF',
				textSecondary: 		'#159EFF',
				buttons:
				[
					'#159EFF'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 31',
				border: 			'#A82175',
				panel: 				'#03ADDB',
				well: 				'#65A64C',
				backgroundBase: 	'#F4931C',
				backgroundPattern: 	'#F24927',	
				textPrimary: 		'#F24927',
				textSecondary: 		'#F24927',
				buttons:
				[
					'#F24927'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 32',
				border: 			'#F8342D',
				panel: 				'#FF803A',
				well: 				'#FFF771',
				backgroundBase: 	'#7EBB41',
				backgroundPattern: 	'#B2FF55',	
				textPrimary: 		'#B2FF55',
				textSecondary: 		'#B2FF55',
				buttons:
				[
					'#B2FF55'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 33',
				border: 			'#9095B0',
				panel: 				'#A9B7C9',
				well: 				'#ECF0E4',
				backgroundBase: 	'#F2C5A0',
				backgroundPattern: 	'#CFA397',	
				textPrimary: 		'#CFA397',
				textSecondary: 		'#CFA397',
				buttons:
				[
					'#CFA397'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 34',
				border: 			'#F32532',
				panel: 				'#F33745',
				well: 				'#F1EFF2',
				backgroundBase: 	'#DACAB9',
				backgroundPattern: 	'#0F0F0D',	
				textPrimary: 		'#0F0F0D',
				textSecondary: 		'#0F0F0D',
				buttons:
				[
					'#0F0F0D'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 35',
				border: 			'#C27481',
				panel: 				'#28405A',
				well: 				'#40668D',
				backgroundBase: 	'#F68F88',
				backgroundPattern: 	'#F3C1C2',	
				textPrimary: 		'#F3C1C2',
				textSecondary: 		'#F3C1C2',
				buttons:
				[
					'#F3C1C2'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 36',
				border: 			'#7D70F2',
				panel: 				'#03BCF7',
				well: 				'#0FD1AD',
				backgroundBase: 	'#F2C758',
				backgroundPattern: 	'#FF7BE3',	
				textPrimary: 		'#FF7BE3',
				textSecondary: 		'#FF7BE3',
				buttons:
				[
					'#FF7BE3'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 37',
				border: 			'#765D6D',
				panel: 				'#6D788B',
				well: 				'#898787',
				backgroundBase: 	'#99A56F',
				backgroundPattern: 	'#F2F2F2',	
				textPrimary: 		'#F2F2F2',
				textSecondary: 		'#F2F2F2',
				buttons:
				[
					'#F2F2F2'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 38',
				border: 			'#2FA7CB',
				panel: 				'#38DFC2',
				well: 				'#FFE358',
				backgroundBase: 	'#FF905C',
				backgroundPattern: 	'#FF6F69',	
				textPrimary: 		'#FF6F69',
				textSecondary: 		'#FF6F69',
				buttons:
				[
					'#FF6F69'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 39',
				border: 			'#888D9E',
				panel: 				'#FAE6D7',
				well: 				'#7DB3C9',
				backgroundBase: 	'#485157',
				backgroundPattern: 	'#14171C',	
				textPrimary: 		'#14171C',
				textSecondary: 		'#14171C',
				buttons:
				[
					'#14171C'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 40',
				border: 			'#464646',
				panel: 				'#F4F3F3',
				well: 				'#5EB8F5',
				backgroundBase: 	'#454345',
				backgroundPattern: 	'#8AAEC7',	
				textPrimary: 		'#8AAEC7',
				textSecondary: 		'#8AAEC7',
				buttons:
				[
					'#8AAEC7'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 41',
				border: 			'#2A0D47',
				panel: 				'#580AB5',
				well: 				'#D4254B',
				backgroundBase: 	'#17C731',
				backgroundPattern: 	'#CBDC1E',	
				textPrimary: 		'#CBDC1E',
				textSecondary: 		'#CBDC1E',
				buttons:
				[
					'#CBDC1E'
				]
			},

			{		// Adobe Mix 
				name: 				'Adobe Mix 42',
				border: 			'#F11F30',
				panel: 				'#F0137A',
				well: 				'#02ACFF',
				backgroundBase: 	'#02A74B',
				backgroundPattern: 	'#F1D008',	
				textPrimary: 		'#F1D008',
				textSecondary: 		'#F1D008',
				buttons:
				[
					'#F1D008'
				]
			},
		];
	}

	static _createThemeFromObject(params) {
		return this._createThemeFromParams(params.name, params.border, params.panel, params.well, params.backgroundBase, params.backgroundPattern, params.textPrimary, params.textSecondary, params.buttons);
	}

	static _createThemeFromParams(name, border, panel, well, backgroundBase, backgroundPattern, textPrimary, textSecondary, buttons) {
		return {
			name: 				name,
			border: 			border,
			panel: 				panel,
			well: 				well,
			backgroundBase: 	backgroundBase,
			backgroundPattern: 	backgroundPattern,
			textPrimary:		textPrimary,
			textSecondary: 		textSecondary,
			buttons: 			buttons,
			_currentColor: 		0,
			getAButtonColor: function() {
				let color = buttons[this._currentColor++];
				if (this._currentColor >= buttons.length) this._currentColor = 0;
				return color;
			},
			reset: function() { this._currentColor = 0; }
		}
	}

	static theme(name) {
		var index = 0;
		var themeList = this.themeList;
		
		for (let i = 0; i < themeList.length; i++)
			if (themeList[i].name === name)
				index = i;

		return this._createThemeFromObject(themeList[index]);
	}

	static random() {
		var themeList = this.themeList;
		var rnd = getRandomInt(0, themeList.length);

		return this.randomFromName(themeList[rnd].name);
	}

	static randomFromName(name) {
		var index = 0;
		var colors = [];
		var themeList = this.themeList;
		
		for (let i = 0; i < themeList.length; i++)
			if (themeList[i].name === name)
				index = i;

		var theme = themeList[index];

		if (colors.indexOf(theme.border) < 0)
			colors.push(theme.border);
		if (colors.indexOf(theme.panel) < 0)
			colors.push(theme.panel);
		if (colors.indexOf(theme.well) < 0)
			colors.push(theme.well);
		if (colors.indexOf(theme.backgroundBase) < 0)
			colors.push(theme.backgroundBase);
		if (colors.indexOf(theme.backgroundPattern) < 0)
			colors.push(theme.backgroundPattern);
		if (colors.indexOf(theme.textPrimary) < 0)
			colors.push(theme.textPrimary);
		if (colors.indexOf(theme.textSecondary) < 0)
			colors.push(theme.textSecondary);

		for (let i = 0; i < theme.buttons.length; i++)
			if (colors.indexOf(theme.buttons[i] < 0))
				colors.push(theme.buttons[i]);

		var newColors = [];
		for (let i = 0; i < 8; i++) {
			let c = colors[getRandomInt(0, colors.length)];

			if 	(
				((i === 3) && (c === newColors[0])) ||
				((i === 3) && (c === newColors[1])) ||
				((i === 4) && (c === newColors[3])) ||
				((i === 5) && (c === newColors[1])) ||
				((i === 7) && (c === newColors[1])) ||
				((i === 7) && (c === newColors[3])))
			{
				i--;
			}
			else { newColors.push(c); }
		}

		var newTheme = this._createThemeFromParams('Random', newColors[0], newColors[1], newColors[2], newColors[3], newColors[4], newColors[5], newColors[6], [ newColors[7] ]);
		console.log(newTheme);
		return newTheme;
	}
}