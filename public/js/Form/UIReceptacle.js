class UIReceptacle {
	constructor(top, left, width, height, scrollMode, hSpacing, vSpacing) {
		this._ready 		= false;
		this._changed 		= true;

		this._top 			= top;
		this._left 			= left;
		this._width 		= width;
		this._height 		= height;

		this._scrollMode 	= scrollMode;
		
		this._hSpacing 		= hSpacing;
		this._vSpacing 		= vSpacing;

		this._content 		= [];

		this.element = new UIElement('div', 'UIReceptacle'
			).setStyle( 'width', 	width
			).setStyle( 'height', 	height
			).setStyle( 'top', 		top
			).setStyle( 'left', 	left );
	}

	addItem(item) {
		if (!this.hasExactItem(item)) {
			this._content.push(item);

			this._changed = true;
		}
	}

	findExactItem(item) {
		for (let i = 0; i < this._content.length; i++)
			if (this._content[i].toString() === item.toString())
				return i;

		return -1;
	}

	hasExactItem(item) {
		if (this.findExactItem(item) >= 0)
			return true;

		return false;
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
		//return new UIRequest('Collection', this._source, this.handleMessage.bind(this));
	}

	render() {
		if (!this._changed)
			return;

		this.element.clear();

		for (let i = 0; i < this._content.length; i++)
			this.element.append(this._content[i].render());

		this._changed = false;

		return this.element.self();
	}

	verifyPosition(top, left, width, height) {
		if (this._top !== top || this._left !== left || this._width !== width || this._height !== height)
			console.log("Receptacle Resize Required!");
	}

	changed() {
		return this._changed;
	}
}