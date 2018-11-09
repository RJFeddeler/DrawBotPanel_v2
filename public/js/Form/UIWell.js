'use strict';

class UIWell {
	constructor(name, source, height, radius, border = 20, lineWidth = 3) {
		this._ready 		= false;
		this._changed 		= true;

		this._radius 		= radius;
		this._border 		= border;
		this._lineWidth 	= lineWidth;

		this._height 		= height;
		this._top 			= 0;

		//this._scrollMode 	= scrollMode;
		
		//this._hSpacing 		= hSpacing;
		//this._vSpacing 		= vSpacing;

		this._content 		= [];

		// Should I save other position/dimension data? (of both well canvas and container)

		this._mainCanvas 	= document.createElement('canvas');
		this._shadowCanvas 	= document.createElement('canvas');

		if (!this._mainCanvas || !this._shadowCanvas)
			return;

		this._mainCanvas.width 	= this._shadowCanvas.width 	= radius * 2;
		this._mainCanvas.height = this._shadowCanvas.height = height + (lineWidth * 2);

		this._mainCanvas.style.zIndex = 15;
		this._mainCanvas.style.zIndex = 39;

		this.element = new UIElement('div', 'UIWell', 'Dynamic', source
			).setStyle('top', 		0
			).setStyle('width', 	radius * 2
			).setStyle('height', 	height
			).append(this._mainCanvas);
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':
				break;
			case 'Shown':
				if (value.top !== undefined && !isNaN(parseInt(value.top))) {
					this._top = parseInt(value.top);
					this._ready = true;
				}

				break;
		}
	}

	update() {
		if (this._ready)
			return new UIRequest('Collection', this.element.source(), this.handleMessage.bind(this));
	}

	render() {
		if (!this._ready || this._height < 5 || this._radius < 5 || this._radius < (this._border * 2))
			return this.element.self();

		let rect = this.drawCanvas(this._mainCanvas);

		if (!this.subElement) {
			this.subElement = new UIElement('div', 'container'
				).setStyle( 'width', 	Math.min(rect.TR.x - rect.TL.x, rect.BR.x - rect.BL.x)
				).setStyle( 'height', 	this._height - (this._lineWidth * 2)
				).setStyle( 'top', 		this._lineWidth * 2
				).setStyle( 'left', 	rect.TL.x + this._lineWidth
			);

			// THIS IS JUST HERE FOR TESTING
			for (let i = 0; i < 19; i++)
				this.addItem(new UIFile('Drawing' + i + '.rob', '2018_01_01', 32, 'Drawing1.png'));

			this.element.append(this.subElement.self());
		}

		//this.verifyPosition(top, left, width, height);

		this.subElement.clear();

		for (let i = 0; i < this._content.length; i++)
			this.subElement.append(this._content[i].render());


		this._changed = false;

		return this.element.self();
	}

	addItem(item) {
		//if (!this.hasExactItem(item)) {
			this._content.push(item);

			this._changed = true;
		//}
	}

	drawCanvas(canvas, justShadow = false) {
		var ctx = canvas.getContext('2d');
		if (!ctx)
			return;

		let hyp = this._radius - this._border;

		let topY = this._radius - this._top - this._lineWidth;
		let botY = topY - this._height;

		let topX = Math.sqrt(hyp * hyp - topY * topY);
		let botX = Math.sqrt(hyp * hyp - botY * botY);

		let pTR  = { x: topX + this._radius, 	y: 0,				rad: atan2ToArc(Math.atan2(topY,  topX)) };
		let pBR  = { x: botX + this._radius, 	y: this._height, 	rad: atan2ToArc(Math.atan2(botY,  botX)) };

		let pTL  = { x: this._radius - topX,	y: 0,				rad: atan2ToArc(Math.atan2(topY, -topX)) };
		let pBL  = { x: this._radius - botX, 	y: this._height, 	rad: atan2ToArc(Math.atan2(botY, -botX)) };

		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.translate(0, this._lineWidth);

		ctx.lineWidth 	= this._lineWidth;
		ctx.strokeStyle = '#0288d1';

		ctx.beginPath();
		ctx.moveTo(pBL.x, pBL.y);
		ctx.arc(this._radius, topY, hyp, pBL.rad, pTL.rad);
		ctx.lineTo(pTR.x, pTR.y);
		ctx.arc(this._radius, topY, hyp, pTR.rad, pBR.rad);
		ctx.lineTo(pBL.x, pBL.y);

		if (!justShadow) {
			ctx.fillStyle = '#333333';
			ctx.fill();
		}

		ctx.globalCompositeOperation='source-atop';
		ctx.shadowColor 	= '#000000';
		ctx.shadowBlur 		= 12;
		ctx.shadowOffsetX 	= 0;
		ctx.shadowOffsetY 	= 0;

		ctx.stroke();
		ctx.stroke();
		ctx.stroke();
		ctx.stroke();

		ctx.restore();

		return { TL: pTL, TR: pTR, BL: pBL, BR: pBR };
	}
}