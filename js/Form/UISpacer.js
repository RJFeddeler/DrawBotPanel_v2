'use strict';

class UISpacer {
	constructor(value) {
		this.element = new UIElement('div', 'UISpacer').setStyle('height', value);
	}

	render() {
		return this.element.self();
	}

	changed() {
		return false;
	}
}