'use strict';

class UIListItem {
	constructor(sourceType, source, size = 'H4') {
		this._sourceType 	= sourceType;
		this._source 		= source;
		this._size 			= size;
		this._value 		= '';
		this._changed 		= true;

		if (this._sourceType === 'Static')
			this._value = this._source;

		this._div = document.createElement('div');
		this._div.setAttribute('class', 'UIListItem' + this._size);
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
		if (this._sourceType === 'Dynamic')
			return new UIRequest('Value', this._source, this.handleMessage.bind(this));
	}

	render() {
		this._div.innerHTML = this._value;
		this._changed = false;

		return this._div;
	}

	changed() {
		return this._changed;
	}
}