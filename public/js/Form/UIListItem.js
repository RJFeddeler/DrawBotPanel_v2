'use strict';

class UIListItem {
	constructor(sourceType, source, size = 'H4', underline = false) {
		this.element = new UIElement('div', 'UIListItem' + size);

		if (underline)
			this.element.addClass('underline');

		this._sourceType = sourceType;
		this._source = source;

		if (sourceType === 'Static') {
			this.handleMessage('Update', source);
			this.state = readyState.FINAL;
		}
		else {
			this.handleMessage('Update', '...');
			this.state = readyState.WAITINGFORDATA;
		}

		return this;
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':
				if (this.value !== value)
					this.element.html(this.value = value);
				break;
			case 'Shown':
				break;
		}
	}

	update() {
		if (this._sourceType === 'Dynamic')
			return new UIRequest('Value', this.source, this.handleMessage.bind(this));
	}

	state() 		{ return this.state; 				}
	domElement() 	{ return this.element.domElement(); }
}