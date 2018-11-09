'use strict';

class UISeparator {
	constructor(type) {
		this.element = new UIElement('div', 'UISeparator', true).append(new UIElement('div', 'UISeparator' + type).domElement());
		this.state = readyState.FINAL;
	}

	state() 		{ return this.state; 				}
	domElement() 	{ return this.element.domElement(); }
}