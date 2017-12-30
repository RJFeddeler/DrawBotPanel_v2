'use strict';

class UISeparator {
	constructor(type) {
		//this.element = new UIElement('div', 'UISeparator' + type, null, null, true).setStyle('height', 15);
		this.element = new UIElement('div', 'UISeparator', null, null, true).append(new UIElement('div', 'UISeparator' + type).self());
	}

	render() {
		return this.element.self();
	}

	changed() {
		return false;
	}
}