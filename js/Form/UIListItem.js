'use strict';

class UIListItem {
	constructor(sourceType, source, size = 'H4') {
		this.element = new UIElement('div', 'UIListItem' + size, sourceType, source);

		this.value = '...';
		if (sourceType === 'Static')
			this.value = source;

		this._changed = true;
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':
				if (this.value !== value) {
					this.value = value;
					this._changed = true;
				}
				break;
			case 'Shown':
				break;
		}

	}

	update() {
		if (this.element.sourceType() === 'Dynamic')
			return new UIRequest('Value', this.element.source(), this.handleMessage.bind(this));
	}

	render() {
		this.element.html(this.value);
		this._changed = false;

		return this.element.self();
	}

	changed() {
		return this._changed;
	}
}