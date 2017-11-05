'use strict';

var modDefaults = { locked: false, start: 1, goal: 1, accel: 0.1, dampen: 1.37, dampenLimit: 0.5, maxValue: 500, startVelocity: 0.1, minVelocity: 0.01, maxVelocity: 50 };

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
        this._originalSettings = circleSettings;
        this._createCircles(circleSettings);
        this.update();
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

		for (var y = 0; y < this._rows; y++) {
			for (var x = 0; x < this._columns; x++) {
				var c = new Circle(x * spacing, y * spacing, settings.radius);
				c.borderWidth = settings.borderWidth;
				c.primaryColor = settings.primaryColor;
				c.fillColor = settings.primaryColor;
				c.showPrimaryColor = false;

				var modStruct = {
						locked: 			true,
						start: 				0,
						goal: 				settings.radius,
						accel: 				0.1,
						dampen: 			1.37,
						dampenLimit: 		0.5,
						maxValue: 			500,
						startVelocity: 		0.5,
						minVelocity: 		0.1,
						maxVelocity: 		50
				}

				var modRadius = c.addMod('radius', modStruct);
				var tRad1 = c.addTriggerToMod(modRadius, ['mouseXY', '<', 50], [ ['set', 'value', 5], ['set', 'velocity', 2] ]);

				/*
				modStruct.goal 				= 1.0;
				modStruct.accel 			= 0.0;
				modStruct.dampen 			= 999;
				modStruct.dampenLimit 		= 0.0;
				modStruct.maxValue 			= 1.0;
				modStruct.startVelocity 	= 0.05;

				var modOpacity = c.addMod('opacity', modStruct);
				*/

				this._circles.push(c);
			}
		}
	}

	createPanel(xPercent, yPercent, radiusPercent, title = '') {
		if (DEBUG_VERBOSE) { console.log("createPanel"); }
		var x = parseInt(this._columns * (xPercent / 100.0));
		var y = parseInt(this._rows * (yPercent / 100.0));
		var id = y * this._columns + x;

		this._circles[id].showPrimaryColor = true;
		this._circles[id].filled = true;

		var m = this._circles[id].getModId('radius');
		if (m >= 0) {
			this._circles[id].addTriggerToMod(m, 'justDoIt', ['set', 'goal', 200], 'whenTriggered');
		}
		else {
			this._circles[id].addMod('radius', modDefaults);
		}
	}

	createRandomAnimation(rate) {
		if (getRandomInt(0, 1) === 2)
			this.createAnimation('verticalLine', rate, getRandomInt(0, this._columns - 1));
		else
			this.createAnimation('horizontalLine', rate, getRandomInt(0, this._rows - 1));
	}

	createAnimation(name, rate, location, fullscreen = false, important = false) {
		if (DEBUG_VERBOSE) { console.log("createAnimation"); }

		for (var i = 0; i < this._animations.length; i++) {
			if (this._animations[i].type === 'fullscreen') {
				if (important) {
					// cancel already running animation somehow
				}
				else { return; }
			}
		}

		/*
		for (var i = 0; i < this._circles.length; i++) {
			for (var j = 0; j < this._circles[i]._mods.length; j++) {
				if (!this._circles[i]._mods[j].finishedAnimation)
					return;
			}
		}
		*/

		var type = (fullscreen ? 'fullscreen' : 'small');
		var a = { name: name, type: type, rate: rate, location: location, lastUpdate: 0, progress: 0, modifiers: [] };

		if (type === 'fullscreen') {
			if (name === 'waveIn') {
				a.modifiers = ['radius'];
				var ms = [{ 	locked:true, start:0, goal:this._originalSettings.radius, accel:0.1, dampen:1.6, dampenLimit:1, maxValue:500, 
								startVelocity:1.0, minVelocity:0.1, maxVelocity:50, finishedAnimation: false }];
			}
		}
		else if (type === 'small') {
			if (name === 'horizontalLine') {
				a.modifiers = ['radius'];
				var ms = [{ locked:true, start:0, accel:0.1, dampen:1.6, dampenLimit:1, startVelocity:1.0, minVelocity:0.1, finishedAnimation: false }];
			}
			if (name === 'verticalLine') {
				a.modifiers = ['radius'];
				var ms = [{ locked:true, start:0, accel:0.1, dampen:1.6, dampenLimit:1, startVelocity:1.0, minVelocity:0.1, finishedAnimation: false }];
			}
		}

		
		if (!Array.isArray(a.modifiers))
			a.modifiers = [a.modifiers];

		if (!Array.isArray(ms))
			ms = [ms];

		if (type === 'fullscreen') {
			for (var i = 0; i < this._circles.length; i++) {
				if (name === 'waveIn') {
					for (var j = 0; j < a.modifiers.length; j++) {
						var modId = this._circles[i].getModId(a.modifiers[j]);
						if (modId >= 0) {
							this._circles[i]._mods[modId].push();
							this._circles[i]._mods[modId].setModSettings(ms[j]);
						}
					}
				}
			}
		}
		else if (type === 'small') {
			if (name === 'horizontalLine') {
				for (var i = 0; i < this._columns; i++) {
					for (var j = 0; j < a.modifiers.length; j++) {
						var c = location * this._columns + i;
						var modId = this._circles[c].getModId(a.modifiers[j]);
						if (modId >= 0) {
							this._circles[c]._mods[modId].push();
							this._circles[c]._mods[modId].setModSettings(ms[j]);
						}
					}
				}
			}
			if (name === 'verticalLine') {
				for (var i = 0; i < this._rows; i++) {
					for (var j = 0; j < a.modifiers.length; j++) {
						var c = i * this._columns + location;
						var modId = this._circles[c].getModId(a.modifiers[j]);
						if (modId >= 0) {
							this._circles[c]._mods[modId].push();
							this._circles[c]._mods[modId].setModSettings(ms[j]);
						}
					}
				}
			}
		}

		this._animations.push(a);
		return this._animations.length - 1;
	}

	_removeAnimation(id) {
		if (DEBUG_VERBOSE) { console.log("_removeAnimation"); }
		var name = this._animations[id].name;
		var mods = this._animations[id].modifiers;
		this._animations.splice(id, 1);

		if (name === 'waveIn') {
			for (var i = 0; i < this._circles.length; i++) {
				for (var j = 0; j < mods.length; j++) {
					this._circles[i]._mods[j].pop();
				}
			}
		}
		else if (name === 'horizontalLine') {

		}
		else if (name === 'verticalLine') {

		}
	}

	_animate(name, progress, param = 0) {
		if (DEBUG_VERBOSE) { console.log("_animateBig"); }

		if (name === 'waveIn') { var animationLength = this._rows + this._columns - 1 };
		if (name === 'horizontalLine') { var animationLength = this._columns - 1 };
		if (name === 'verticalLine') { var animationLength = this._rows - 1 };

		if (progress > animationLength || progress < 0)
			return -1;

		if (name === 'waveIn') {
			var list = UISelector.forwardDiagonal(this._columns, this._rows, progress);
			for (var i = 0; i < list.length; i++) {
				var m = this._circles[list[i]].getModId('radius');
				this._circles[list[i]]._mods[m].locked = false;
				//m = this._circles[list[i]].getModId('opacity');
				//this._circles[list[i]]._mods[m].locked = false;
			}
		}
		else if (name === 'horizontalLine') {
			//var a = { name: name, type: type, rate: rate, location: location, lastUpdate: 0, progress: 0, modifiers: ['radius'] };
			//var ms = [{ locked:false, start:0, accel:0.1, dampen:1.6, dampenLimit:1, startVelocity:1.0, minVelocity:0.1, finishedAnimation: false }];
			var c = param * this._columns + progress;
			var m = this._circles[c].getModId('radius');
			//this._circles[c]._mods[m].enabled = true;
			this._circles[c]._mods[m].velocity = 0.0;
			this._circles[c]._mods[m].enabled = true;
			this._circles[c]._mods[m].value = 0.0;
			this._circles[c]._mods[m].locked = false;
		}
		else if (name === 'verticalLine') {
			//var a = { name: name, type: type, rate: rate, location: location, lastUpdate: 0, progress: 0, modifiers: ['radius'] };
			//var ms = [{ locked:false, start:0, accel:0.1, dampen:1.6, dampenLimit:1, startVelocity:1.0, minVelocity:0.1, finishedAnimation: false }];
			var c = progress * this._rows + param;
			var m = this._circles[c].getModId('radius');
			//this._circles[c]._mods[m].enabled = true;
			this._circles[c]._mods[m].velocity = 0.0;
			this._circles[c]._mods[m].enabled = true;
			this._circles[c]._mods[m].value = 0.0;
			this._circles[c]._mods[m].locked = false;
		}

		if (name === 'waveIn') { return ++progress; }
		else if (name === 'horizontalLine') { return ++progress; }
		else if (name === 'verticalLine') { return ++progress; }

		return -1;
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
			this.ctx.arc(this._circles[i].x + this._circles[i].offsetX, this._circles[i].y + this._circles[i].offsetY, this._circles[i].radius, 0, 2*Math.PI);
			
			this._circles[i].mouseIn = (this.ctx.isPointInPath($mouseX, $mouseY)) ? true : false;
			
			this.ctx.stroke();

			if (this._circles[i].filled) {
				this.ctx.fillStyle = c;
				this.ctx.fill();
			}

			if (o < 1.0)
				this.ctx.globalAlpha = 1.0;
		}
	}

	getCircleFromXY(x, y) { return y * this._columns + x; }

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

	_updateAnimations() {
		if (DEBUG_VERBOSE) { console.log("_updateAnimations"); }
		if (!this.ready)
			return;

		for (var i = 0; i < this._animations.length; i++) {
			if (true) { //(this._animations[i].type === 'fullscreen') {
				var now = new Date();
				var timeDelta = (1000.0 / this._animations[i].rate);
				if ((now - this._animations[i].lastUpdate) > timeDelta) {
					if (this._animations[i].progress >= 0)
						this._animations[i].progress = this._animate(this._animations[i].name, this._animations[i].progress, this._animations[i].location);
					else {
						if (this._animations[i].type === 'fullscreen') {
							var animationComplete = true;
							for (var j = 0; j < this._circles.length && animationComplete === true; j++) {
								for (var k = 0; k < this._animations[i].modifiers.length; k++) {
									var m = this._circles[j].getModId(this._animations[i].modifiers[k]);
									if ((m >= 0) && (!this._circles[j]._mods[m].finishedAnimation))
										animationComplete = false;
								}
							}
							if (animationComplete) {
								this._removeAnimation(i);
								continue;
							}
						}
						else if (this._animations[i].type === 'small') {

						}
					}

					this._animations[i].lastUpdate = now;
				}
			}
		}
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

		this._updateAnimations();
		this._updateCircles();
		this._drawCanvas();
	}
}
