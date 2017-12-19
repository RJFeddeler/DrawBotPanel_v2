'use strict';

class UISeparator {
	constructor(type) {
		this._type 	= type;
		this._div 	= document.createElement('div');

		this._div.style.height = '15px';
		this._div.setAttribute('class', 'autoWidth ' + (this._value === 'top' ? 'separatorTop' : 'separatorBottom'));
	}

	render() {
		return this._div;
	}

	changed() {
		return false;
	}
}