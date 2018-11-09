'use strict';

class UISubmitButton {
	constructor(systemLink) {
		var system = systemLink();

		if (!system)
			return;

		this.element = new UIElement('div', 'UISubmitButton');
		this.element.html('<button class="btn-floating waves-effect waves-dark" type="submit" name="action"><i class="material-icons">send</i></button>');
		this.element.addListener( "click", 	function() { system.mouseClick( 'Command', 'BLAHZZZNOW' ); }.bind(this));
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

	state() 		{ return this.state; 				}
	domElement() 	{ return this.element.domElement(); }
}