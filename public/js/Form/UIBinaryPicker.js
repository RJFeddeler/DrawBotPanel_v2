'use strict';

class UIBinaryPicker {
	constructor(header, option1, option2, headerSize, optionSize) {
		this.element = new UIElement('div', 'UIBinaryPicker');

		this._opt1 			= option1;
		this._opt2 			= option2;
		this._header		= header;
		this._headerSize 	= headerSize || 'Font_H2';
		this._optionSize 	= optionSize || 'Font_H4';
		this._picked 		= -1;

		this.divHeader = new UIElement('div', 'UIBinaryPicker_Header').html(this._header).addClass(headerSize);
		this.divOptions = document.createElement('div');
		this.divOpt1   = new UIElement('div', 'UIBinaryPicker_Option').html(this._opt1).addClass(optionSize).addListener('click', function() { this.handleMessage('Update', 0); }.bind(this));
		this.divOpt2   = new UIElement('div', 'UIBinaryPicker_Option').html(this._opt2).addClass(optionSize).addListener('click', function() { this.handleMessage('Update', 1); }.bind(this));

		this.element.append(this.divHeader.domElement());

		this.divOpt1.appendTo(this.divOptions);
		this.divOpt2.appendTo(this.divOptions);

		this.element.append(this.divOptions);

		this.handleMessage('Update', 0);
		this.state = readyState.FINAL;

		return this;
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':
				if (value !== this._picked && (value === 0 || value === 1)) {
					this._picked = value;
					if (value == 0) {
						this.divOpt2.removeClass('picked');
						this.divOpt1.addClass('picked');
					}
					else {
						this.divOpt1.removeClass('picked');
						this.divOpt2.addClass('picked');
					}
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