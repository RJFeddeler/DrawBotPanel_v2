'use strict';

class UIStrength {
	constructor(source, segments = 6) {
		this.element = new UIElement('div', 'UIStrength', 'Dynamic', source);

		this._segments 	= segments;
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

		for (let i = 0; i < this._segments; i++) {
			let subdiv = document.createElement('div');
			
			subdiv.style.width 	= '5px';
			subdiv.style.height = (i * 5 + 1) + 'px';

			if (i >= Math.ceil(this._value / 100.0 * this._segments))
				subdiv.className = 'Dim';

			this.element.append(subdiv);
		}

		this._changed = false;

		return this.element.self();
	}

	changed() {
		return this._changed;
	}
}