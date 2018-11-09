'use strict';

const modButtonRadius = 35;

class UIButton {
	constructor(event, eventArg, shape, label, icon, mouseClick, mouseOver, mouseOut) {
		this._event 		= event;
		this._eventArg 		= eventArg;
		this._shape 		= shape;

		this._label			= label;
		this._icon 			= icon;

		var m = this._shape.getModByName('radius');
		if (m) {
			m.push();
			m.addTrigger( new Trigger( 50, ['mouseXY', 'isIn'], 'resetOnMouseOutAtGoal'
				).setConsequences( { velocity: 2.0, acceleration: 0.15, dampen: 2.0, dampenZero: 1.3, velocityZero: 1.2 } ) );
			m.addTrigger( new Trigger( 80, ['atGoal'], 'removeWhenTriggered'
				).setPassthrough( { buttonShown: this } ) );
			m.addTrigger( new Trigger( 80, ['passedGoal'], 'removeWhenTriggered'
				).setConsequences( { goal: modButtonRadius, velocity: 1.0, acceleration: 0.3, dampen: 3.0, dampenZero: 2.0, velocityZero: 2.0 }
				).setPassthrough( { showPrimary: true, filled: true } ) );
			m.addTrigger( new Trigger( 80, ['doNow'], 'removeWhenTriggered'
				).setConsequences( { goal: 0, locked: false, velocity: 0.5, acceleration: -0.25 } ) );
		}

		this.element = new UIElement('div', 'UIButton'
			).setStyle( 'top', this._shape.y() + 28
			).setStyle( 'left', this._shape.x() - 20
			).setStyle( 'width', modButtonRadius
			).setStyle( 'height', modButtonRadius
			).html( '<i class="fas fa-' + this._icon + ' fa-fw"></i>'
			).addListener( "mouseover", function() { mouseOver( this._label ); }.bind(this)
			).addListener( "mouseout", 	function() { mouseOut(); }.bind(this)
			).addListener( "click", 	function() { mouseClick( this._event, this._eventArg ); }.bind(this)
			).appendTo( document.body
			).createAnimation(
				{ name: 'fadeUp' },
				{ name: 'fadeDown-out' },
				false,
				true
		);
	}

	makeFileInput() {
		var i = document.createElement('input');
		i.type = 'file';
		i.className = 'hiddenFileInput';

		this.element.append(i);
	}

	remove() {
		var m = this._shape.getModByName('radius');
		if (m) {
			m.addTrigger( new Trigger( 90, ['passedGoal'], 'removeWhenTriggered'
				).setPassthrough( { pop: true, resetPrimary: true, showPrimary: false, filled: false } ) );
			m.addTrigger( new Trigger( 90, ['doNow'], 'removeWhenTriggered'
				).setConsequences( { locked: false, goal: 0, velocity: 3.0, acceleration: -0.5 } ) );
		}

		this.element.playHideAnimation();
	}

	shape() { return this._shape; }
}