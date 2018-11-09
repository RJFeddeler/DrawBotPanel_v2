'use strict';

class UIToggle {
	constructor(label, labelSize, onByDefault) {
		this._label			= label;
		this._labelSize 	= labelSize || 'Font_H4';

		if (onByDefault)
			this._value = 1;
		else
			this._value = 0;

		this.element = new UIElement('div', 'UIToggle'
			).addClass('switch'
			).addClass(labelSize
			).html('<label>' + this._label + ': <input type="checkbox"><span class="lever"></span></label>'
		);

		//this.handleMessage('Update', 0);
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