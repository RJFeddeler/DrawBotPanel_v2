'use strict';

var modDefaults = { locked: false, start: 1, goal: 1, acceleration: 0.1, dampen: 1.37, dampenLimit: 0.5, maxValue: 100, startVelocity: 0.1, minVelocity: 0.01, maxVelocity: 50 };

class UICircles {
	constructor(canvasID, marginHeight, circleSettings, width, height) {
		this.ready = false;
		this.canvas = document.getElementById(canvasID)
		
		if (this.canvas) 	{ this.ctx = this.canvas.getContext('2d'); }
		if (this.ctx) 		{ this.init(marginHeight, circleSettings, width, height); }
	}

	init(marginHeight, circleSettings, width, height) {
        this.ready = this.ctx ? true : false;
        if (!this.ready)
        	return;

        this.canvasWidth = width;
        this.canvasHeight = height - (2 * marginHeight - 12);

        this.canvas.setAttribute('width', this.canvasWidth);
        this.canvas.setAttribute('height', this.canvasHeight);

        this._backgroundColor = circleSettings.backgroundColor;
        this._font = this.ctx.font;
        this._originalSettings = circleSettings;
        this._createCircles(circleSettings);
        this.update();
	}

	createPanel(xPercent, yPercent, radiusPercent, title = '') {
		if (DEBUG_VERBOSE) { console.log("createPanel"); }
		var x = parseInt(this._columns * (xPercent / 100.0));
		var y = parseInt(this._rows * (yPercent / 100.0));
		var id = y * this._columns + x;

		this._circles[id].showPrimaryColor = true;
		this._circles[id].filled = true;

		var m = this._circles[id].getModId('radius');
		if (m < 0) {
			this._circles[id].addMod('radius', modDefaults);
			m = this._circles[id].getModId('radius');
		}

		if (m >= 0)
			this._circles[id].addTriggerToMod(m, 'doNow', ['set', 'goal', 200], 'whenTriggered');
	}

	createButton(x, y, radius, icon) {
		if (DEBUG_VERBOSE) { console.log("createButton"); }
		
		if (x >= this._columns)
			x = this._columns - 1;
		if (y >= this._rows)
			y = this._rows - 1;

		var id = y * this._columns + x;

		var m = this._circles[id].getModId('radius');
		if (m < 0)
			m = this._circles[id].addMod('radius', modDefaults);
		else
			this._circles[id].removeTriggerFromMod(m, 'mouseXY');

		this._circles[id].font = '40px FontAwesome';

		switch (icon) {
			case 'home': 					icon = '\uF015'; 	break;
			case 'eye': 					icon = '\uF06E'; 	break;
			case 'search': 					icon = '\uF002'; 	break;
			case 'pencil': 					icon = '\uF040'; 	break;
			case 'pencil-square': 			icon = '\uF14B'; 	break;
			case 'pencil-square-o': 		icon = '\uF044'; 	break;
			case 'paint-brush': 			icon = '\uF1FC'; 	break;
			case 'print': 					icon = '\uF02F'; 	break;
			case 'file': 					icon = '\uF15B'; 	break;
			case 'file-o': 					icon = '\uF016'; 	break;
			case 'file-text': 				icon = '\uF15C'; 	break;
			case 'file-text-o': 			icon = '\uF0F6'; 	break;
			case 'files-o': 				icon = '\uF0C5'; 	break;
			case 'clone': 					icon = '\uF24D'; 	break;
			case 'file-code-o': 			icon = '\uF1C9'; 	break;
			case 'file-image-o': 			icon = '\uF1C5'; 	break;
			case 'cog': 					icon = '\uF013'; 	break;
			case 'cogs': 					icon = '\uF085'; 	break;
			case 'sliders': 				icon = '\uF1DE'; 	break;
			case 'bars': 					icon = '\uF0C9'; 	break;
			case 'tasks': 					icon = '\uF0AE'; 	break;
			case 'wrench': 					icon = '\uF0AD'; 	break;
			case 'ellipsis-h': 				icon = '\uF141'; 	break;
			case 'ellipsis-v': 				icon = '\uF142'; 	break;
			case 'exclamation': 			icon = '\uF12A'; 	break;
			case 'exclamation-triangle': 	icon = '\uF071'; 	break;
			case 'exclamation-circle': 		icon = '\uF06A'; 	break;
			case 'window-close': 			icon = '\uF2D3'; 	break;
			case 'window-close-o': 			icon = '\uF2D4'; 	break;
			case 'times': 					icon = '\uF00D'; 	break;
			case 'times-circle': 			icon = '\uF057'; 	break;
			case 'times-circle-o': 			icon = '\uF05C'; 	break;
			default: 						icon = '\uF12A'; 	break;
		}

		this._circles[id].text = icon;
		
		this._circles[id].addTriggerToMod(m, 'doNow',[
			['push'],
			['set', 'velocity', 0.5],
			['set', 'acceleration', -0.25],
			['set', 'goal', 0],
			['addTrigger', ['value', '<', 0], [
				['pop'], 
				['set', 'showPrimaryColor', true], 
				['set', 'filled', true], 
				['set', 'velocity', -1.0], 
				['multiply', 'acceleration', 4], 
				['set', 'dampen', 2], 
				['set', 'dampenLimit', 2], 
				['set', 'goal', radius],
				['addTrigger', 'atGoal', 
					['set', 'isButton', true]
				]
			], 'whenTriggered'] ], 'whenTriggered');
	}

	createAnimation(name, rate, parameters, fullscreen = false, important = false) {
		var modNames = ['radius'];
		var actions = [ ['unlock'], ['push'], ['set', 'value', 0.0], ['set', 'velocity', 1.0], ['set', 'acceleration', 0.1], ['set', 'minVelocity', 0.1], ['set', 'dampen', 1.6], ['set', 'dampenLimit', 1.0], ['addTrigger', 'atGoal', ['pop'], 'whenTriggered'] ];
		var lines = [];

		if (!fullscreen) {
			var line = [];

			if (name === 'horizontalLine')
				line = UISelector.horizontal(this._columns, this._rows, getRandomInt(1, this._rows));
			else if (name === 'verticalLine')
				line = UISelector.vertical(this._columns, this._rows, getRandomInt(1, this._columns));
			else if (name === 'forwardDiagonalLine')
				line = UISelector.forwardDiagonal(this._columns, this._rows, getRandomInt(1, this._columns + this._rows - 1));
			else if (name === 'backwardDiagonalLine')
				line = UISelector.backwardDiagonal(this._columns, this._rows, getRandomInt(1, this._columns + this._rows - 1));

			for (var i = 0; i < line.length; i++)
				lines.push([ line[i] ]);
		}
		else {
			if (name === 'horizontalLine')
				for (var i = 0; i < this._rows; i++)
					lines.push(UISelector.horizontal(this._columns, this._rows, i));
			else if (name === 'verticalLine')
				for (var i = 0; i < this._columns; i++)
					lines.push(UISelector.vertical(this._columns, this._rows, i));
			else if (name === 'forwardDiagonalLine')
				for (var i = 0; i < this._columns + this._rows - 1; i++)
					lines.push(UISelector.forwardDiagonal(this._columns, this._rows, i));
			else if (name === 'backwardDiagonalLine')
				for (var i = 0; i < this._columns + this._rows - 1; i++)
					lines.push(UISelector.backwardDiagonal(this._columns, this._rows, i));
		}

		var m;
		var now = new Date();
		for (var i = 0; i < modNames.length; i++) {
			for (var j = 0; j < lines.length; j++) {
				for (var k = 0; k < lines[j].length; k++) {
					m = this._circles[lines[j][k]].getModId(modNames[i]);
					if (m >= 0) {
						this._circles[lines[j][k]].addTriggerToMod(m, ['doAfter', now.getTime(), j * (1000.0 / rate)], actions, 'whenTriggered');
					}
				}
			}
		}
	}

	createRandomAnimation(rate) {
		var i = getRandomInt(0, 4);

		if (i === 0)
			this.createAnimation('forwardDiagonalLine', rate, null);
		else if (i === 1)
				this.createAnimation('backwardDiagonalLine', rate, null);
		else if (i === 2)
			this.createAnimation('verticalLine', rate, null);
		else
			this.createAnimation('horizontalLine', rate, null);
	}

	clearAnimations() {
		for (var i = 0; i < this._circles.length; i++)
			;
	}

	_createCircles(settings) {
		if (DEBUG_VERBOSE) { console.log("_createCircles"); }
		if (!this.ready)
			return;

		this._circles = [];
		this._animations = [];

		var spacing = (2 * settings.radius) + settings.distance;
		this._columns = parseInt(this.canvasWidth / spacing) + 2;
		this._rows = parseInt(this.canvasHeight / spacing) + 2;

		var circleCenter = {	x: ((Math.floor(this._columns / 2) - 1) * spacing),
								y: (Math.floor(this._rows / 2) * spacing) };

		var centerOffset = { 	x: ((this.canvasWidth  / 2.0) - circleCenter.x),
								y: ((this.canvasHeight / 2.0) - circleCenter.y) };

		for (var y = 0; y < this._rows; y++) {
			for (var x = 0; x < this._columns; x++) {
				var c = new Circle(x * spacing + centerOffset.x, y * spacing + centerOffset.y, settings.radius);
				c.borderWidth = settings.borderWidth;
				c.primaryColor = settings.primaryColor;
				c.fillColor = settings.primaryColor;
				c.showPrimaryColor = false;

				var modStruct = {
						locked: 			true,
						start: 				0,
						goal: 				settings.radius,
						acceleration:		0.1,
						dampen: 			1.37,
						dampenLimit: 		0.5,
						maxValue: 			100,
						startVelocity: 		0.5,
						minVelocity: 		0.1,
						maxVelocity: 		50
				}

				var modRadius = c.addMod('radius', modStruct);
				var tRadius1 = c.addTriggerToMod(modRadius, ['mouseXY', '<', 50], [ ['set', 'value', 5], ['set', 'velocity', 2] ]);

				this._circles.push(c);
			}
		}
	}

	_drawCircles(layer) {
		if (!this.ready)
			return;

		var c;
		for (var i = 0; i < this._circles.length; i++) {
			if (this._circles[i].radius <= 0)
				continue;

			this.ctx.globalCompositeOperation = "source-over";

			if (layer === 0) { 		// Background
				if (this._circles[i].showPrimaryColor) { continue; }
				c = this._backgroundColor;
			}
			else if (layer === 1) { // Mask
				if (this._circles[i].showPrimaryColor) { continue; }
				else {
					c = '#000000';
				}
			}
			else if (layer === 2) { // Primary
				if (!this._circles[i].showPrimaryColor) { continue; }
				else {
					c = this._circles[i].primaryColor;
				}
			}

			this.ctx.strokeStyle = c;
        	this.ctx.lineWidth = this._circles[i].borderWidth;

        	var o = 1.0;
        	if (layer === 0 && !this._circles[i].showPrimaryColor)
        		o = 1.0 - this._circles[i].opacity;
        	else if (layer === 2)
        		o = this._circles[i].opacity;

        	if (o === 0.0)
        		continue;

        	if (o < 1.0 && layer > 0)
        		this.ctx.globalAlpha = o;

        	this.ctx.beginPath();
			this.ctx.arc(this._circles[i].x + this._circles[i].xOffset, this._circles[i].y + this._circles[i].yOffset, this._circles[i].radius, 0, 2*Math.PI);
			
			this._circles[i].mouseIn = (this.ctx.isPointInPath($mouseX, $mouseY)) ? true : false;
			
			if (layer === 2) {
				this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
				this.ctx.shadowBlur = 10;
				this.ctx.shadowOffsetX = 0;
				this.ctx.shadowOffsetY = 4;
			}

			this.ctx.stroke();

			if (this._circles[i].filled) {
				this.ctx.fillStyle = c;
				this.ctx.fill();
			}

			this.ctx.shadowColor = "black";
			this.ctx.shadowBlur = 0;
			this.ctx.shadowOffsetX = 0;
			this.ctx.shadowOffsetY = 0;

			if (this._circles[i].isButton) {
				if (this._circles[i].font === '' || this._circles[i].text === '')
					this._circles[i].isButton = false;
				else {
					if (this._circles[i].mouseIn) {
						this.ctx.shadowColor = 'rgba(200, 190, 100, 0.9)';
						this.ctx.shadowBlur = 7;
						this.ctx.shadowOffsetX = 0;
						this.ctx.shadowOffsetY = 0;
					}

					this.ctx.font = this._circles[i].font;
					this.ctx.fillStyle = '#222222';
					this.ctx.fillText(this._circles[i].text, this._circles[i].x - 20, this._circles[i].y + 15);
					this.ctx.font = this._font;

					if (this._circles[i].mouseIn) {
						this.ctx.shadowColor = "black";
						this.ctx.shadowBlur = 0;
						this.ctx.shadowOffsetX = 0;
						this.ctx.shadowOffsetY = 0;
					}
				}
			}

			if (o < 1.0)
				this.ctx.globalAlpha = 1.0;
		}
	}

	getCircleFromXY(x, y) { return y * this._columns + x; }

	get center() { return { x: (Math.floor(this._columns / 2) - 1), y: Math.floor(this._rows / 2) }; }

	_drawMaskLayer() { this._drawCircles(1); }

	_drawColorLayer() {
		if (!this.bgGradient) {
			this.bgGradient = this.ctx.createLinearGradient(0, 0, this.canvasWidth, 0);
			this.bgGradient.addColorStop(0, '#ff0000');		// RED
			this.bgGradient.addColorStop(0.25, '#ff7f00');	// ORANGE
			this.bgGradient.addColorStop(0.5, '#ffff00');	// YELLOW
			this.bgGradient.addColorStop(0.75, '#00ff00');	// GREEN
			this.bgGradient.addColorStop(1, '#0000ff');		// BLUE
		}

		this.ctx.globalCompositeOperation = "source-in";
		this.ctx.fillStyle = this.bgGradient;
		this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.ctx.globalCompositeOperation = "source-over";
	}

	_drawBackground() {
		this.ctx.globalCompositeOperation = "destination-atop";
		this.ctx.fillStyle = this._backgroundColor;
		this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

		this._drawCircles(0);
	}

	_drawTopLayer() { this._drawCircles(2); }

	_clearCanvas() { this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); }

	_drawCanvas() {
		if (!this.ready)
			return;

		this._clearCanvas();
		this._drawMaskLayer();
		this._drawColorLayer();
		this._drawBackground();
		this._drawTopLayer();
	}

	_updateCircles() {
		if (DEBUG_VERBOSE) { console.log("_updateCircles"); }
		if (!this.ready)
			return;

		for (var i = 0; i < this._circles.length; i++)
			this._circles[i].update();
	}

	update() {
		if (!this.ready)
			return;

		this._updateCircles();
		this._drawCanvas();
	}
}
