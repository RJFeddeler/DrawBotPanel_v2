'use strict';

class UICarousel {
	constructor(source, itemWidth, itemHeight) {
		this._readyState 	= 0;
		this._ready 		= false;

		this._itemWidth 	= itemWidth;
		this._itemHeight 	= itemHeight;

		this._source 		= source;
		this._items 		= [];

		this.element = new UIElement('div', 'UICarousel');

		this._testFiles = [ '4Boxes.rob', '2006AcuraTL.rob', 'Boxes.rob', 'CarFront.rob', 'MyCarFront.rob', 'StupidBoxes.rob', 'TheCarFront.rob', 'UmmBoxes.rob' ];
		this._testFiles.sort(function(a, b) { if (b.fileName < a.fileName) return 1; else return -1; });

		for (let i = 0; i < this._testFiles.length; i++)
			this.addItem( new UIFile( this._testFiles[i] ) ).element.setStyle('width', this._itemWidth).setStyle('height', this._itemHeight);

		var leftButton = document.createElement('div');
		leftButton.className = 'directionButton';
		leftButton.style.float = 'left';
		leftButton.innerHTML = '<i class="fa fa-caret-left"></i>';

		var rightButton = document.createElement('div');
		rightButton.className = 'directionButton';
		rightButton.style.float = 'right';
		rightButton.innerHTML = '<i class="fa fa-caret-right"></i>';

		var stackBottom = document.createElement('div');
		stackBottom.className = 'fileStack';
		stackBottom.style.width = (this._itemWidth * 1.45) + 'px';
		stackBottom.style.height = (this._itemHeight * 0.28) + 'px';

		var stackMiddle = document.createElement('div');
		stackMiddle.className = 'fileStack';
		stackMiddle.style.width = (this._itemWidth * 1.25) + 'px';
		stackMiddle.style.height = (this._itemHeight * 0.66) + 'px';

		stackMiddle.appendChild(leftButton);
		stackMiddle.appendChild(rightButton);

		var indicators = document.createElement('div');
		indicators.className = 'indicators';
		indicators.style.top = 'calc(100% + 10px)';

		var lastLetter = '';
		for (let i = 0; i < this._items.length; i++) {
			let curLetter = this._items[i].fileName().toUpperCase().substr(0, 1);
			if (!isNaN(curLetter))
				curLetter = '#';
			if (lastLetter === curLetter)
				curLetter = '';
			if (curLetter !== '')
				lastLetter = curLetter;

			let indicatorDiv = document.createElement('div');
			indicatorDiv.className = 'indicator';
			indicatorDiv.innerHTML = '<div><i class="fa fa-circle"></i></div><div>' + curLetter + '</div>';

			indicators.appendChild(indicatorDiv);
		}

		this._title = document.createElement('div');
		this._title.className = 'title';

		this._preview = document.createElement('div');
		this._preview.className = 'preview';
		this._preview.style.width = this._itemWidth + 'px';
		this._preview.style.height = this._itemHeight + 'px';

		this.element.clear();
		this.element.setStyle('width', this._itemWidth).setStyle('height', this._itemHeight);

		this.element.append(stackBottom);
		this.element.append(stackMiddle);
		this.element.append(indicators);

		this.element.append(this._title);
		this.element.append(this._preview);

		return this;
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
		if (!this._ready) {
			let progress = 0;
			for (let i = 0; i < this._items.length; i++)
				if (this._items[i].ready())
					progress++;

			progress /= this._items.length;

			if (progress >= 1.0) {
				this._ready = true;
				this.showItem(0);
			}

			return;
		}

		//return new UIRequest('Collection', this.element.source(), this.handleMessage.bind(this));
	}

	showItem(item) {
		if (item >= this._items.length)
			return;

		this._title.innerHTML = '<p>' + this._items[item].title + '</p><p>' + beautifyDate(this._items[item].creationDate()) + '</p>';
		this._preview = this._items[item].domElement();

		SVG.playPathAnimation(this._preview);
	}

	addItem(item) {
		//console.log("UICarousel : addItem()");
		return this._items[ this._items.push(item) - 1];
	}

	domElement() { return this.element.domElement(); }
}