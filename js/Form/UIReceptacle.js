class UIReceptacle {
	constructor(source, x, y, width, height, scrollMode, hSpacing, vSpacing) {
		this._selector 		= '#UIReceptacle_' + this._source;
		this._source 		= source;
		this._changed 		= true;

		this._x 			= x;
		this._y 			= y;
		this._width 		= width;
		this._height 		= height;

		this._scrollMode 	= scrollMode;
		
		this._hSpacing 		= hSpacing;
		this._vSpacing 		= vSpacing

		this._div = document.createElement('div');
		this._div.setAttribute('class', 'UIReceptacle');

		this._div.style.width 	= this._width 	+ 'px';
		this._div.style.height 	= this._height 	+ 'px';
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
		return new UIRequest('Collection', this._source, this.handleMessage.bind(this));
	}

	render(container) {
		this._changed = false;

		return this._div;
	}

	changed() {
		return this._changed;
	}
}