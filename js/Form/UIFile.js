'use strict';

class UIFile {
	constructor(fileName, creationDate, fileSize, preview) {
		this.element = new UIElement('div', 'UIFile');

		this._fileName 		= fileName;
		this._creationDate 	= creationDate;
		this._fileSize 		= fileSize;
		this._preview 		= preview;

		this._changed = true;
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

	render() {
		this.element.clear();

		var topHalf = document.createElement('div');
		topHalf.className = 'topHalf';

		this.element.append(topHalf);

		this._changed = false;

		return this.element.self();
	}

	toString() {
		return this._fileName + "," + this._creationDate + "," + this._fileSize + "," + this._preview;
	}

	changed() {
		return this._changed;
	}
}