'use strict';

class UIMultiPicker {
	constructor(header, options, headerSize, optionSize) {
		this.element = new UIElement('div', 'UIBinaryPicker');

		if (header !== null) {
			this._header		= header;
			this._headerSize 	= headerSize || 'Font_H2';
		}

		this._optionSize 	= optionSize || 'Font_H4';

		this._options 		= options;
		this._picked 		= -1;

		if (header) {
			this.divHeader = new UIElement('div', 'UIMultiPicker_Header').html(this._header).addClass(headerSize);
			this.element.append(this.divHeader.domElement());
		}
		
		this.divOptions = document.createElement('div');

		this._optionElements = [];
		for (let i = 0; i < this._options.length; i++)
			this._optionElements.push(
				new UIElement('div', 'UIMultiPicker_Option'
					).html(this._options[i]
					).addClass(optionSize
					).addListener('click', function() { this.handleMessage('Update', i); }.bind(this)
					).appendTo(this.divOptions
				)
			);

		this.element.append(this.divOptions);

		this.handleMessage('Update', 0);
		this.state = readyState.FINAL;

		return this;
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':
				if (value !== this._picked && value >= 0 && value < this._options.length) {
					this._picked = value;

					for (let i = 0; i < this._optionElements.length; i++)
						this._optionElements[i].removeClass('picked');

					this._optionElements[this._picked].addClass('picked');
				}
				break;
			case 'Shown':
				break;
		}
	}

	update() {
	}

	state() 		{ return this.state; 				}
	domElement() 	{ return this.element.domElement(); }
}