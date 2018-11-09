'use strict';

class UIStrength {
	constructor(source, segments = 6) {
		this.element = new UIElement('div', 'UIStrength');
		this.state 	= readyState.WAITINGFORDATA;

		this._source = source;

		this._segments 	= segments;
		this._value 	= 0;

		for (let i = 0; i < this._segments; i++) {
			let subDiv = document.createElement('div');
			
			subDiv.style.height = (i * 5 + 1) + 'px';
			subDiv.style.width 	= '5px';
			subDiv.className 	= 'Dim';

			this.element.append(subDiv);
		}
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':
				if (this._value !== value) {
					this._value = value;
					let segments = this.element.queryAll('div');
					for (let i = 0; i < segments.length; i++)
						if (i >= Math.ceil(this._value / 100.0 * this._segments))
							segments[i].classList.add('Dim');
						else
							segments[i].classList.remove('Dim');
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