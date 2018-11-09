'use strict';

class UIProgress {
	constructor(source, segments = 0) {
		this.element = new UIElement('div', 'UIProgress');
		this.state 	= readyState.WAITINGFORDATA;

		this._source = source;

		this._segments 	= segments;
		this._value 	= 0;


		for (let i = 0; i < this._segments; i++) {
			let subDiv = document.createElement('div');
			
			subDiv.style.width 	= '5px';

			this.element.append(subDiv);
		}
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':
				if (this._value !== value) {
					this._value = value;
					//let segments = this.element.queryAll('div');
				}
				break;
			case 'Shown':
				break;
		}
	}

	update() {
		return new UIRequest('Value', this._source, this.handleMessage.bind(this));
	}

	state() 		{ return this.state; 				}
	domElement() 	{ return this.element.domElement(); }
}