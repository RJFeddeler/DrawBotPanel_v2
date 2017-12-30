'use strict';

class UISplit {
	constructor(data) {
		this.element = new UIElement('div', 'UISplit');

		this._listItems = [];
		this._changed 	= true;

		for (let i = 0; i < data.length; i++) {
			let subdiv = document.createElement('div');
			let items  = [];
			for (let j = 0; j < data[i].length; j++) {
				items.push(new UIListItem(data[i][j].sourceType, data[i][j].source, data[i][j].size));
				subdiv.appendChild(items[items.length - 1].render());
			}

			this._listItems.push(items);
			this.element.append(subdiv);
		}
	}

	handleMessage(msg, value) {
	}

	update() {
		let updates = [];
		for (let i = 0; i < this._listItems.length; i++) {
			for (let j = 0; j < this._listItems[i].length; j++)
				updates.push(this._listItems[i][j].update());
		}

		return updates;
	}

	render() {
		for (let i = 0; i < this._listItems.length; i++) {
			for (let j = 0; j < this._listItems[i].length; j++)
				this._listItems[i][j].render();
		}

		this._changed = false;

		return this.element.self();
	}

	changed() {
		for (let i = 0; i < this._listItems.length; i++)
			for (let j = 0; j < this._listItems[i].length; j++)
				if (this._listItems[i][j].changed())
					this._changed = true;

		return this._changed;
	}
}