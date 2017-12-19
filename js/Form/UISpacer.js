'use strict';

class UISpacer {
	constructor(value) {
		this._value = value;
		this._div 	= document.createElement('div');

		this._div.style.height = this._value;
	}

	render() {
		return this._div;
	}

	changed() {
		return false;
	}
}