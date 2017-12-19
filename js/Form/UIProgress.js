'use strict';

class UIProgress {
	constructor(source) {
		this._source	= source;
		this._value 	= 0;
		this._changed 	= true;

		this._div = document.createElement('div');
		this._div.setAttribute('class', 'UIProgress');
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
		return new UIRequest('Value', this._source, this.handleMessage.bind(this));
	}

	render() {
		clearDiv(this._div);

		this._changed = false;

		return this._div;
	}

	changed() {
		return this._changed;
	}
}