'use strict';

class UIWell {
	constructor(name, source, height, radius, border = 20, lineWidth = 3) {
		this._selector 		= '#UIWell_' + name;
		this._source 		= source;
		this._ready 		= false;
		this._changed 		= true;

		this._top 			= 0;
		this._height 		= height;
		this._radius 		= radius;
		this._border 		= border;
		this._lineWidth 	= lineWidth;

		this._canvas = document.createElement('canvas');

		if (this._canvas)
			this._ctx = this._canvas.getContext('2d');

		if (!this._ctx)
			return;

		this._canvas.width 	= this._radius * 2;
		this._canvas.height = this._height + (this._lineWidth * 2);
		this._canvas.style.zIndex = 15;

		this._div = document.createElement('div');
		this._div.setAttribute('class', 'UIWell');
		this._div.id = this._selector.slice(1);

		this._div.style.width 	= (this._radius * 2) + 'px';
		this._div.style.height 	= this._height + 'px';

		this._div.appendChild(this._canvas);
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':
				break;
			case 'Shown':
				this._top = $(this._selector).position().top;
				this._ready = true;
				break;
		}
	}

	update() {
		if (this._ready)
			return new UIRequest('Collection', this._source, this.handleMessage.bind(this));
	}

	render(container) {
		if (!this._ready)
			return this._div;

		if (this._height < 5 || this._radius < 5 || this._radius < (this._border * 2))
			return this._div;

		let hyp = this._radius - this._border;

		let topY = this._radius - this._top - this._lineWidth;
		let botY = topY - this._height;

		let topX = Math.sqrt(hyp * hyp - topY * topY);
		let botX = Math.sqrt(hyp * hyp - botY * botY);

		let pTR  = { x: topX + this._radius, 	y: 0,				rad: atan2ToArc(Math.atan2(topY,  topX)) };
		let pBR  = { x: botX + this._radius, 	y: this._height, 	rad: atan2ToArc(Math.atan2(botY,  botX)) };

		let pTL  = { x: this._radius - topX,	y: this._lineWidth,	rad: atan2ToArc(Math.atan2(topY, -topX)) };
		let pBL  = { x: this._radius - botX, 	y: this._height, 	rad: atan2ToArc(Math.atan2(botY, -botX)) };

		this._ctx.save();
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._ctx.translate(0, this._lineWidth);

		this._ctx.lineWidth 	= this._lineWidth;
		this._ctx.strokeStyle 	= '#0288d1';

		this._ctx.beginPath();
		this._ctx.moveTo(pBL.x, pBL.y);
		this._ctx.arc(this._radius, topY, hyp, pBL.rad, pTL.rad);
		this._ctx.lineTo(pTR.x, pTR.y);
		this._ctx.arc(this._radius, topY, hyp, pTR.rad, pBR.rad);
		this._ctx.lineTo(pBL.x, pBL.y);

		this._ctx.fillStyle = '#0288d1';
		this._ctx.fill();
		this._ctx.fillStyle = '#333333';
		this._ctx.fill();

		this._ctx.globalCompositeOperation='source-atop';
		this._ctx.shadowColor 	= '#000000';
		this._ctx.shadowBlur 	= 12;
		this._ctx.shadowOffsetX = 0;
		this._ctx.shadowOffsetY = 0;

		this._ctx.stroke();
		this._ctx.stroke();
		this._ctx.stroke();
		this._ctx.stroke();

		this._ctx.restore();

		this._changed = false;

		return this._div;
	}

	changed() {
		return this._changed;
	}
}