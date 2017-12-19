'use strict';

class Mouse {
	constructor() {
		this._x = -1;
		this._y = -1;
		this._lastUpdate = new Date();

		window.addEventListener('mousemove', function(e) { this._updatePosition(e); }.bind(this));
	}

	_updatePosition(e) {
		var rect = bgcanvas.getBoundingClientRect();
	    this._x = e.clientX - rect.left;
	    this._y = e.clientY - rect.top
	    this._lastUpdate = new Date();
	}

	x() { return this._x; }
	y() { return this._y; }
	limit() { return { x: windowWidth(), y: windowHeight() }; }
	lastUpdate() { return this._lastUpdate; }
}