'use strict';

class UILightButton {
	constructor(systemLink, cmd, label, icon) {
		this._cmd 	= cmd;
		this._label = label;
		this._icon  = icon;

		var system = systemLink();

		if (!system)
			return;

		this.element = new UIElement( 'div', 'UILightButton'
			).html('<i class="fas fa-' + this._icon + ' fa-fw"></i>'
			).addListener( "mouseover", function() { system.mouseOver( this._label ); }.bind(this)
			).addListener( "mouseout", 	function() { system.mouseOut(); }.bind(this)
			).addListener( "click", 	function() { system.mouseClick( 'Command', this._cmd ); }.bind(this)
		);

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