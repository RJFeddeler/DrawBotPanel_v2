'use strict';

class UISplit {
	constructor(data) {
		this.element = new UIElement('div', 'UISplit');

		this._items = [];

		for (let i = 0; i < data.length; i++) {
			let subdiv = document.createElement('div');
			let items  = [];
			for (let j = 0; j < data[i].length; j++) {
				if (data[i][j].type == 'UIListItem')
					items.push(new UIListItem(data[i][j].sourceType, data[i][j].source, data[i][j].size, data[i][j].underline));
				else if (data[i][j].type == 'UINumberBox')
					items.push(new UINumberBox(data[i][j].name, data[i][j].defaultValue, data[i][j].min, data[i][j].max, data[i][j].fontSize ));

				subdiv.appendChild(items[items.length - 1].domElement());
			}

			this._items.push(items);
			this.element.append(subdiv);
		}
	}

	handleMessage(msg, value) {
	}

	update() {
		let updates = [];
		for (let i = 0; i < this._items.length; i++) {
			for (let j = 0; j < this._items[i].length; j++)
				updates.push(this._items[i][j].update());
		}

		return updates;
	}

	state() 		{ return this.state; 				}
	domElement() 	{ return this.element.domElement(); }
}