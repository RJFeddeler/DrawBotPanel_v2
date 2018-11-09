'use strict';

class UICanvas {
	constructor(width, height) {
		this._width  = width;
		this._height = height;

		this._canvas = document.createElement('canvas');
		
		this._canvas.width  = this._width;
		this._canvas.height = this._height;

		this._ctx = this._canvas.getContext("2d");

		this.element = new UIElement( 'div', 'UICanvas'
			).append(this._canvas
		);

		this.state = readyState.FINAL;

		return this;
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':
				break;
			case 'Shown':
				break;
		}
	}

	update() {
	}

	resetCanvas() {
		this._canvas.width  = this._width;
		this._canvas.height = this._height;

		this._ctx.fillStyle = 'rgba(0, 0, 0, 0)';
		this._ctx.fillRect(0, 0, this._width, this._height);
	}

	canvas() 		{ return this._canvas; 				}
	ctx() 			{ return this._ctx; 				}

	state() 		{ return this.state; 				}
	domElement() 	{ return this.element.domElement(); }
}