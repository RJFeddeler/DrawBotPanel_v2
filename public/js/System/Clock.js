'use strict';

class Clock {
	constructor(tickLength) {
		this.tickLength 	= tickLength;
		this.lastTick 		= performance.now();
		this.lastRender 	= this._lastTick;
		this.running 		= true;
	}
}