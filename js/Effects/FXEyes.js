'use strict';

class FXEyes {
	constructor(leftEye, rightEye, parent) {
		this._leftEye 		= leftEye;
		this._rightEye 		= rightEye;

		this._pupils 		= { x: 0, y: 0 };
		this._eyeLids		= 100;

		this._canvasID 		= 'canvasEyes';

		this._canvas = this._createCanvas(
			(leftEye.radius() + leftEye.radius() + (rightEye.x() - leftEye.x()) + rightEye.radius() + rightEye.radius()),
			(leftEye.radius() + leftEye.radius() + rightEye.radius() + rightEye.radius()),
			parent.left + leftEye.x() - leftEye.radius() - leftEye.radius(),
			parent.top + leftEye.y() - leftEye.radius() - leftEye.radius()
		);

		this._ctx = this._canvas.getContext('2d');

		if (!this._ctx)
			this.delete();


	}

	render() {
		let c = '#ffffff';

		this._ctx.save();

		this._ctx.strokeStyle = c;
		this._ctx.fillStyle = c;
    	this._ctx.lineWidth = 2;

    	//this._ctx.shadowColor 	= 'rgba(0, 0, 0, 0.8)';
		//this._ctx.shadowBlur 	= 10;
		//this._ctx.shadowOffsetX = 0;
		//this._ctx.shadowOffsetY = 4;

    	this._ctx.beginPath();
		this._ctx.arc(this._leftEye.radius() * 2, this._leftEye.radius() * 2, this._leftEye.radius(), 0, 2 * Math.PI);
		this._ctx.stroke();
		//this._ctx.fill();

		/*
		this._ctx.beginPath();
		this._ctx.arc(this._leftEye.radius() + (this._rightEye.offset().x - this._leftEye.offset().x), this._rightEye.radius(), this._rightEye.radius(), 0, 2 * Math.PI);
		this._ctx.stroke();
		this._ctx.fill();
		*/

		this._ctx.restore();
	}

	update() {

	}

	_createCanvas(width, height, x, y) {
		var canvas = document.createElement('canvas');

		canvas.id 				= this._canvasID;
		canvas.width 			= width;
		canvas.height 			= height;
		canvas.style.zIndex 	= 10;
		canvas.style.position 	= "absolute";
		canvas.style.top 		= y + 'px';
		canvas.style.left 		= x + 'px';
		canvas.style.border 	= "1px solid red";

		document.body.appendChild(canvas);

		return canvas;
	}

	delete() {
		$('#' + this._canvasID).remove();
	}
}