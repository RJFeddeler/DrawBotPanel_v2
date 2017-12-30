'use strict';

class UIProgress {
	constructor(source) {
		this.element = new UIElement('div', 'UIProgress', 'Dynamic', source);

		this._value 	= 0;
		this._changed 	= true;
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':
				if (this._value !== value) {
					this._value 	= value;
					this._changed 	= true;
				}
				
				break;
			case 'Shown':
				break;
		}
	}

	update() {
		return new UIRequest('Value', this.element.source(), this.handleMessage.bind(this));
	}

	render() {
		this.element.clear();

		this._changed = false;

		return this.element.self();
	}

	changed() {
		return this._changed;
	}
}