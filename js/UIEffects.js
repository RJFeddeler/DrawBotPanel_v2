'use strict';

class UIEffects {
	constructor(rows, columns) {
		this._rows 				= rows;
		this._columns 			= columns;
		this._circleCount 		= rows * columns;

		this._temporaryShapes 	= [];
	}

	createSingleBounce(id, delay = 0, zIndex = 5) {
		var now = new Date();
		var startTime = new Date(now.getTime() + delay);

		var m = ui._circles[id].getModByName('radius');
		if (!m)
			return;

		var t = new Trigger(zIndex, ['doNow'], 'removeAtGoal', startTime, false);
		t.setPrimaryConsequences({ locked: false, value: 0, velocity: 1 });
		t.setSecondaryConsequences({ acceleration: 0.1, dampen: 1.2, dampenZero: 1.0 });
		m.addTrigger(t);
	}

	createSingleFloatToTop(id, radius, delay = 0, zIndex = 5) {
		if ((id < 0) || (id >= this._rows * this._columns))
			return;

		var modStruct 	= {
				locked: 			false,
				value: 				ui._circles[id].radius,
				goal: 				maxRadius,
				velocity: 			2.0,
				acceleration: 		0.1,
				maxValue: 			1000,
				dampen: 			10.0,
				dampenLimit: 		10.0,
				velocityZero: 		0.1,
				maxVelocity: 		10
		}

		var now = new Date();
		for (var i = 0; i < circleCount; i++) {
			do {
				
			} while (modStruct.velocity === 0.0 )

			var c = new Circle(ui._circles[id].x + ui._circles[id].xOffset, ui._circles[id].y + ui._circles[id].yOffset, modStruct.value);
			c.borderWidth = 3;

			var m = new Mod('radius', modStruct);
			var t = new Trigger(zIndex, ['passedGoal'], 'removeWhenTriggered', 'now', false);
			t.setPrimaryConsequences({});
			t.setPassthrough({ deleteCircle: true });
			t.setSecondaryConsequences({});

			m.addTrigger(t);
			c.addMod(m);

			var settings = { animation: 'flash', startAlpha: 1.0, startRadius: modStruct.value, endRadius: modStruct.goal, timeAdded: now, delay: delay };
			this._temporaryShapes.push({ shape: c, settings: settings });
		}
	}

	createSingleFlash(id, delay = 0, zIndex = 5) {
		if ((id < 0) || (id >= this._rows * this._columns))
			return;

		var circleCount	= 10;
		var maxStartRadius = 30;
		var maxRadius 	= 60;
		var modStruct 	= {
				locked: 			false,
				maxValue: 			1000,
				dampen: 			10.0,
				dampenLimit: 		10.0,
				velocityZero: 		0.1,
				maxVelocity: 		10
		}

		var now = new Date();
		for (var i = 0; i < circleCount; i++) {
			do {
				modStruct.value 	= ui._circles[id].radius;
				modStruct.goal 		= maxRadius;
				modStruct.velocity 	= (i + 1) / 2.0;
				modStruct.acceleration = 0.1;
			} while (modStruct.velocity === 0.0 )

			var c = new Circle(ui._circles[id].x + ui._circles[id].xOffset, ui._circles[id].y + ui._circles[id].yOffset, modStruct.value);
			c.borderWidth = 3;

			var m = new Mod('radius', modStruct);
			var t = new Trigger(zIndex, ['passedGoal'], 'removeWhenTriggered', 'now', false);
			t.setPrimaryConsequences({});
			t.setPassthrough({ deleteCircle: true });
			t.setSecondaryConsequences({});

			m.addTrigger(t);
			c.addMod(m);

			var settings = { animation: 'flash', startAlpha: 1.0, startRadius: modStruct.value, endRadius: modStruct.goal, timeAdded: now, delay: delay };
			this._temporaryShapes.push({ shape: c, settings: settings });
			console.log(this._temporaryShapes.length);
		}
	}

	randomAnimationGroup() {
		if (!this._groupHistory)
			this._groupHistory = [ -1, -1 ];

		const groupCount = 1;
		var group = getRandomInt(0, groupCount);

		if ((this._groupHistory[0] === this._groupHistory[1]) && (groupCount > 1))
			while (group === this._groupHistory[1])
				group = getRandomInt(0, groupCount)

		this._groupHistory[0] = this._groupHistory[1];
		this._groupHistory[1] = group;

		if 		(group === 0) 	return 'bounce';
		else if (group === 1) 	return 'flash';
		else 					return '';
	}

	randomAnimationDirection() {
		if (!this._directionHistory)
			this._directionHistory = [ -1, -1 ];

		const directionCount = 4;
		var direction = getRandomInt(0, directionCount);

		if ((this._directionHistory[0] === this._directionHistory[1]) && (directionCount > 1))
			while (direction === this._directionHistory[1])
				direction = getRandomInt(0, directionCount)

		this._directionHistory[0] = this._directionHistory[1];
		this._directionHistory[1] = direction;

		if 		(direction === 0) 	return 'horizontal';
		else if (direction === 1) 	return 'vertical';
		else if (direction === 2) 	return 'forwardDiagonal';
		else if (direction === 3) 	return 'backwardDiagonal';
		else 						return '';
	}

	randomAnimationLineOffset(direction) {
		var lineOffsetBorder = 0;
		var lineOffsetCount  = 1;

		if 		(direction === 'horizontal') 		{ lineOffsetBorder = 2; lineOffsetCount = this._rows; 					}
		else if (direction === 'vertical') 			{ lineOffsetBorder = 2; lineOffsetCount = this._columns;				}
		else if (direction === 'forwardDiagonal') 	{ lineOffsetBorder = 4; lineOffsetCount = this._rows + this._columns;	}
		else if (direction === 'backwardDiagonal') 	{ lineOffsetBorder = 4; lineOffsetCount = this._rows + this._columns;	}
		
		return getRandomInt(lineOffsetBorder, lineOffsetCount - lineOffsetBorder);
	}

	animateRandomPoint() {
		if (!this._pointHistory)
			this._pointHistory = [ -1, -1 ];

		var pointBorder = 2;
		var group 		= this.randomAnimationGroup();
		var point 		= getRandomInt(pointBorder, this._rows - pointBorder) * this._columns + getRandomInt(pointBorder, this._columns - pointBorder);

		if (this._pointHistory[0] === this._pointHistory[1])
			while (point === this._pointHistory[1])
				point = getRandomInt(pointBorder, this._rows - pointBorder) * this._columns + getRandomInt(pointBorder, this._columns - pointBorder);

		this._pointHistory[0] = this._pointHistory[1];
		this._pointHistory[1] = point;

		this.animatePoint(group, 0, point);
	}

	animateRandomLine(rate) {
		var group 		= this.randomAnimationGroup();
		var direction 	= this.randomAnimationDirection();
		var lineOffset 	= this.randomAnimationLineOffset(direction);
		
		this.animateLine(group, 0, 40, direction, lineOffset);
	}

	animatePoint(group, start, point, zIndex = 9) {
		if 		(group === 'bounce') 	this.createSingleBounce(point, start, zIndex);
		else if (group === 'flash') 	this.createSingleFlash( point, start, zIndex);
	}

	animateLine(group, start, rate, direction, lineOffset, zIndex = 10) {
		var line;

		if 		(direction === 'horizontal') 		line = UISelector.horizontal(		this._columns, this._rows, lineOffset);
		else if (direction === 'vertical') 			line = UISelector.vertical(			this._columns, this._rows, lineOffset);
		else if (direction === 'forwardDiagonal') 	line = UISelector.forwardDiagonal(	this._columns, this._rows, lineOffset);
		else if (direction === 'backwardDiagonal')	line = UISelector.backwardDiagonal(	this._columns, this._rows, lineOffset);
		
		var delay = 0;
		if (rate > 0)
			delay = 1000 / rate;

		for (var i = 0; i < line.length; i++) {
			if 		(group === 'bounce') 	this.createSingleBounce(line[i], i * delay + start, zIndex);
			else if (group === 'flash') 	this.createSingleFlash( line[i], i * delay + start, zIndex);
		}
	}

	animateScreen(group, rate, direction) {
		var zIndex = 20;

		var delay = 0;
		if (rate > 0)
			delay = 1000 / rate;

		var lineCount;
		if 		(direction === 'horizontal') 		lineCount = this._rows;
		else if (direction === 'vertical') 			lineCount = this._columns;
		else if (direction === 'forwardDiagonal') 	lineCount = this._columns + this._rows - 1;
		else if (direction === 'backwardDiagonal') 	lineCount = this._columns + this._rows - 1;

		for (var i = 0; i < lineCount; i++)
			this.animateLine(group, i * delay, 0, direction, i, zIndex);
	}

	draw() {
		var now = new Date();
		for (var i = 0; i < this._temporaryShapes.length; i++) {
			if ((now - this._temporaryShapes[i].settings.timeAdded) < this._temporaryShapes[i].settings.delay)
				continue;

			if (this._temporaryShapes[i].shape.radius <= 0)
				continue;
			
			if (this._temporaryShapes[i].settings.animation === 'flash') {
				var alpha = this._temporaryShapes[i].settings.startAlpha - (this._temporaryShapes[i].settings.startAlpha * ((this._temporaryShapes[i].shape.radius - this._temporaryShapes[i].settings.startRadius) / (this._temporaryShapes[i].settings.endRadius - this._temporaryShapes[i].settings.startRadius)));
				var c = 'rgba(2, 136, 209, ' + alpha + ')'; //white to blue random?
			}
			else if (this._temporaryShapes[i].settings.animation === 'floatToTop') {
				var c = 'rgba(2, 136, 209, 0.5)';
			}

			ui._ctx.globalCompositeOperation = "source-over";
			ui._ctx.strokeStyle = c;


        	ui._ctx.lineWidth = this._temporaryShapes[i].shape.borderWidth;
        	ui._ctx.beginPath();
			ui._ctx.arc(this._temporaryShapes[i].shape.x + this._temporaryShapes[i].shape.xOffset, this._temporaryShapes[i].shape.y + this._temporaryShapes[i].shape.yOffset, this._temporaryShapes[i].shape.radius, 0, 2*Math.PI);
			ui._ctx.stroke();

			if (this._temporaryShapes[i].shape.filled) {
				ui._ctx.fillStyle = c;
				ui._ctx.fill();
			}
		}
	}

	update() {
		var result;
		var now = new Date();
		for (var i = 0; i < this._temporaryShapes.length; i++) {
			if ((now - this._temporaryShapes[i].settings.timeAdded) >= this._temporaryShapes[i].settings.delay) {
				result = this._temporaryShapes[i].shape.update();

				if (result.deleteCircle)
					this._temporaryShapes.splice(i--, 1);
			}
		}

		this.draw();
	}
}