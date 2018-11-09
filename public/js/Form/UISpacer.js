'use strict';

class UISpacer {
	constructor(value) {
		this.element = new UIElement('div', 'UISpacer').setStyle('height', value);
		this.state = readyState.FINAL;
	}

	state() 		{ return this.state; 				}
	domElement() 	{ return this.element.domElement(); }
}