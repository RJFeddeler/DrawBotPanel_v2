'use strict';

class UIStrength {
	constructor(source, segments = 6) {
		this._source	= source;
		this._segments 	= segments;
		this._value 	= 0;
		this._changed 	= true;

		this._div = document.createElement('div');
		this._div.setAttribute('class', 'UIStrength');
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

		for (let i = 0; i < this._segments; i++) {
			let subdiv = document.createElement('div');
			
			subdiv.style.width 	= '5px';
			subdiv.style.height = (i * 5 + 1) + 'px'

			if (i >= Math.ceil(this._value / 100.0 * this._segments))
				subdiv.setAttribute('class', 'Dim');

			this._div.appendChild(subdiv);
		}

		this._changed = false;

		return this._div;
	}

	changed() {
		return this._changed;
	}
}