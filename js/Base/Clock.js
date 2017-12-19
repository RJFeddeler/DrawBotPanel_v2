'use strict';

class Clock {
	constructor(tickLength) {
		this.tickLength 	= tickLength;
		this.lastTick 		= performance.now();
		this.lastRender 	= this._lastTick;
		this.running 		= true;

		window.addEventListener('mousedown', function() { if (mouse.y() < 10 && mouse.x() > (mouse.limit().x - 10)) this.running = false; }.bind(this));
	}
}