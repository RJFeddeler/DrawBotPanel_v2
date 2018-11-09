'use strict';

class UINumberBox {
	constructor(name, defaultValue, min, max, fontSize = 'Font_H6') {
		this.element = new UIElement('div', 'UINumberBox').addClass('input-field').addClass(fontSize);

		this._name 		= name;
		this._value 	= -1;
		this._min 		= min;
		this._max 		= max;
		this._fontSize 	= fontSize;

		this.element.html('<input id="numBox' + this._name + '" type="number"><label for="numBox' + this._name + '">' + this._name + '</label>');
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

	state() 		{ return this.state; 				}
	domElement() 	{ return this.element.domElement(); }
}