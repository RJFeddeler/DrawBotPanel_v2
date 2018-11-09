'use strict';

class ShapeEffects {
	constructor(ctx, shapes, shapeName, rows, columns, startAnimation, periodicAnimation) {
		this._ctx				= ctx;
		this._shapes 			= shapes;
		this._shapeName 		= shapeName;
		this._rows 				= rows;
		this._columns 			= columns;

		this._effects 			= [];
		this._tempShapes 		= [];

		if (periodicAnimation !== undefined && periodicAnimation.speed > 0 && periodicAnimation.interval > 0)
			this.startPeriodicAnimation(periodicAnimation.speed, periodicAnimation.interval, periodicAnimation.startDelay);

		if (startAnimation !== undefined && startAnimation.speed > 0)
			this.animateScreen(startAnimation.name, startAnimation.speed, startAnimation.direction);
	}

	startPeriodicAnimation(speed, interval, startDelay) {
		this._periodicSpeed 		= speed;
		this._periodicInterval 		= interval;
		this._periodicLastUpdate 	= new Date(0);

		if (startDelay > 0)
			setTimeout(function() { this._periodicEnabled = true; }.bind(this), startDelay);
		else
			this._periodicEnabled = true;
	}

	stopPeriodicAnimation() {
		this._periodicEnabled = false;
	}

	createSingleBounce(shape, delay = 0, zIndex = 10) {
		if (shape.hidden())
			return;

		var now 		= new Date();
		var startTime 	= new Date(now.getTime() + delay);

		var m = shape.getModByName('radius');
		if (m) {
			m.addTrigger(new Trigger(zIndex, ['doNow'], 'removeAtGoal', startTime
				).setConsequences({ locked: false, value: 0, velocity: 1, acceleration: 0.1, dampen: 1.7, dampenZero: 1.0 }));
		}
	}

	createSingleFloatToTop(shape, delay = 0, zIndex = 10) {
		if (shape.hidden())
			return;
	}

	createSingleFlash(shape, delay = 0, zIndex = 10) {
		if (shape.hidden())
			return;

		var shapeCount		= 10,
			maxStartRadius 	= 30,
			maxRadius 		= 60,
			modStruct 		= {
				locked: 			false,
				value: 				shape.radius(),
				goal: 				maxRadius,
				acceleration: 		0.1,
				maxValue: 			1000,
				dampen: 			10.0,
				dampenZero: 		10.0,
				velocityZero: 		0.1,
				maxVelocity: 		10 }

		var now = new Date();
		for (var i = 0; i < shapeCount; i++) {
			modStruct.velocity 	= (i + 1) / 2.0;

			if (this._shapeName === 'Circle')
				var s = new Circle(this._tempShapes.length, shape.x() + shape.offset().x, shape.y() + shape.offset().y, shape.radius(), 3, shape.primaryColor());
			
			if (s) {
				s.addMod(new Mod('radius', modStruct).addTrigger(new Trigger(zIndex, ['passedGoal'], 'removeWhenTriggered', 'now').setPassthrough({ deleteShape: true })));

				var settings = { animation: 'flash', startAlpha: 1.0, startRadius: modStruct.value, endRadius: modStruct.goal, timeAdded: now, started: false, delay: delay };
				this._tempShapes.push({ shape: s, settings: settings });
			}
		}
	}

	createEyes(x, y) {
		//var leftEye 	= this._shapes[getRandomInt(2, this._rows - 2) * this._columns + getRandomInt(2, this._columns - 3)];
		var leftEye 	= this._shapes[5 * this._columns + 3];
		var rightEye 	= this._shapes[leftEye.id() + 1];
		var parent 		= $('#' + this._ctx.canvas.id).offset();

		if (leftEye && rightEye && parent) {
			leftEye.setHidden(true);
			rightEye.setHidden(true);

			this._effects.push(new FXEyes(leftEye, rightEye, parent));
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

	animateRandomLine(speed) {
		this._testPerformed = true;
		if (!this._testPerformed) {
			this._testPerformed = true;

			this.createEyes(3, 5);

			return;
		}

		var group 		= this.randomAnimationGroup();
		var direction 	= this.randomAnimationDirection();
		var lineOffset 	= this.randomAnimationLineOffset(direction);
		
		this.animateLine(group, 0, speed, direction, lineOffset);
	}

	animatePoint(group, shape, start, zIndex = 10) {
		if 		(group === 'bounce') 	this.createSingleBounce(shape, start, zIndex);
		else if (group === 'flash') 	this.createSingleFlash (shape, start, zIndex);
	}

	animateLine(group, start, speed, direction, lineOffset, zIndex = 10) {
		var line;

		if 		(direction === 'horizontal') 		line = ShapeSelector.horizontal(this._columns, this._rows, lineOffset);
		else if (direction === 'vertical') 			line = ShapeSelector.vertical(this._columns, this._rows, lineOffset);
		else if (direction === 'forwardDiagonal') 	line = ShapeSelector.forwardDiagonal(this._columns, this._rows, lineOffset);
		else if (direction === 'backwardDiagonal')	line = ShapeSelector.backwardDiagonal(this._columns, this._rows, lineOffset);
		
		var delay = ((speed > 0) ? (1000 / speed) : 0);

		for (let i = 0; i < line.length; i++)
			this.animatePoint(group, this._shapes[line[i]], i * delay + start, zIndex);
	}

	animateScreen(group, speed, direction) {
		var zIndex = 90;

		var delay = 0;
		if (speed > 0)
			delay = 1000 / speed;

		var lineCount;
		if 		(direction === 'horizontal') 		lineCount = this._rows;
		else if (direction === 'vertical') 			lineCount = this._columns;
		else if (direction === 'forwardDiagonal') 	lineCount = this._columns + this._rows - 1;
		else if (direction === 'backwardDiagonal') 	lineCount = this._columns + this._rows - 1;

		for (var i = 0; i < lineCount; i++)
			this.animateLine(group, i * delay, 0, direction, i, zIndex);
	}

	draw(tempShape) {
		if (tempShape.shape.radius() <= 0)
			return;
		
		if (tempShape.settings.animation === 'flash') {
			var alpha = tempShape.settings.startAlpha - (tempShape.settings.startAlpha * ((tempShape.shape.radius() - tempShape.settings.startRadius) / (tempShape.settings.endRadius - tempShape.settings.startRadius)));
			var c = 'rgba(2, 136, 209, ' + alpha + ')';
		}
		else if (tempShape.settings.animation === 'floatToTop') {
			var c = 'rgba(2, 136, 209, 0.5)';
		}

		this._ctx.globalCompositeOperation = "source-over";
		this._ctx.strokeStyle = c;

    	this._ctx.lineWidth = tempShape.shape.border();
    	this._ctx.beginPath();

    	tempShape.shape.draw(this._ctx);
		
		this._ctx.stroke();

		if (tempShape.shape.filled()) {
			this._ctx.fillStyle = c;
			this._ctx.fill();
		}
	}

	render() {
		let now = new Date();

		for (let i = 0; i < this._tempShapes.length; i++)
			if (this._tempShapes[i].settings.started)
				this.draw(this._tempShapes[i]);

		for (let i = 0; i < this._effects.length; i++)
			this._effects[i].render();
	}

	update(lastTick) {
		let now = new Date();

		for (let i = 0; i < this._tempShapes.length; i++) {
			if (!this._tempShapes[i].settings.started) {
				if ((now - this._tempShapes[i].settings.timeAdded) >= this._tempShapes[i].settings.delay)
					this._tempShapes[i].settings.started = true;
			}
			else {
				if (this._tempShapes[i].shape.update().deleteShape)
					this._tempShapes.splice(i--, 1);
			}
		}

		for (let i = 0; i < this._effects.length; i++)
			this._effects[i].update();

		if (this._periodicEnabled && ((now - this._periodicLastUpdate) > this._periodicInterval)) {
			this.animateRandomLine(this._periodicSpeed);
			this._periodicLastUpdate = new Date();
		}
	}
}