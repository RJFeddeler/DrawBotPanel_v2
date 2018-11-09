'use strict';

class UITextBox {
	constructor(name, value, fontSize = 'Font_H4') {
		this.element = new UIElement('div', 'UINumberBox').addClass('input-field').addClass(fontSize);

		this._name 		= name;
		this._value 	= value;
		this._fontSize 	= fontSize;

		this.element.html('<input id="textBox' + this._name + '" type="text" class="validate"><label for="textBox' + this._name + '">' + this._name + '</label>');
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