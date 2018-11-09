'use strict';

class UISlidePicker {
	constructor(label, labelSize, noUiSliderData) {
		this._label 	= label;
		this._labelSize = labelSize || 'Font_H4';

		var l = document.createElement("div");
		l.className = 'UISlidePicker_Label ' + this._labelSize;
		l.innerHTML = this._label;

		this.element = new UIElement('div', 'UISlidePicker'
			).addClass('sliders'
		);

		noUiSlider.create(this.element.domElement(), noUiSliderData);

		this.element.append(l);

		this.state = readyState.FINAL;

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
	}

	value() {
		return this.domElement().noUiSlider.get();
	}

	state() 		{ return this.state; 				}
	domElement() 	{ return this.element.domElement(); }
}