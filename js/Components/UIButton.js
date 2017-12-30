'use strict';

const modButtonRadius = 35;

class UIButton {
	constructor(event, eventArg, shape, name, label, icon, color) {
		this._event 	= event;
		this._eventArg 	= eventArg;
		this._shape 	= shape;

		this._name 		= name;
		this._label		= label;
		this._icon 		= icon;

		this._ready 	= false;
		this._selector 	= '#UIButton' + this._shape.id();

		var m = this._shape.getModByName('radius');
		if (m) {
			m.push();
			m.addTrigger(new Trigger(50, ['mouseXY', 'isIn'], 'resetOnMouseOutAtGoal'
				).setConsequences({ velocity: 2.0, acceleration: 0.15, dampen: 2.0, dampenZero: 1.3, velocityZero: 1.2 }));
			m.addTrigger(new Trigger(80, ['atGoal'], 'removeWhenTriggered'
				).setPassthrough({ buttonShown: true }));
			m.addTrigger(new Trigger(80, ['passedGoal'], 'removeWhenTriggered'
				).setConsequences({ goal: modButtonRadius, velocity: 1.0, acceleration: 0.3, dampen: 3.0, dampenZero: 2.0, velocityZero: 2.0 }
				).setPassthrough({ showPrimary: true, filled: true }));
			m.addTrigger(new Trigger(80, ['doNow'], 'removeWhenTriggered'
				).setConsequences({ goal: 0, locked: false, velocity: 0.5, acceleration: -0.25 }));

			if (color)
				this._shape.setPrimary(color);
		}
	}

	shown(mouseOver, mouseOut, mouseClick) {
		this._fMouseOver 	= mouseOver;
		this._fMouseOut 	= mouseOut;
		this._fMouseClick 	= mouseClick;

		this.showIcon();
		this._ready = true;
	}

	click() {
		var transitionName = 'UIButtonClick';
		var transitionEnd  = 'webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend';
        $(this._selector).addClass(transitionName).one(transitionEnd, function() { $(this).removeClass(transitionName); });

        this._fMouseClick(this._event, this._eventArg);
	}

	showIcon() {
		var div = document.createElement("div")
		
		div.setAttribute('class', 'UIButton');
		div.id = this._selector.slice(1);

		div.style.top 			= '' + (this._shape.y() + 25) + 'px';
		div.style.left 			= '' + (this._shape.x() - 24) + 'px';
		div.style.width 		= '' + modButtonRadius + 'px';
		div.style.height 		= '' + modButtonRadius + 'px';
		div.innerHTML 			= '<i class="fa fa-' + this._icon + ' fa-fw fa-size"></i>';

		document.body.appendChild(div);

		div.addEventListener("mouseover", 	function() { this._fMouseOver(this._label); }.bind(this));
		div.addEventListener("mouseout", 	function() { this._fMouseOut(); }.bind(this));
		div.addEventListener("click", 		function() { this.click(); }.bind(this));

		this._animation = new UIAnimation( div, { name: 'fadeLessUp' }, { name: 'fadeLessDown-out' }, true );
	}

	delete() {
		this._ready = false;

		var m = this._shape.getModByName('radius');
		if (m) {
			m.addTrigger(new Trigger(90, ['passedGoal'], 'removeWhenTriggered'
				).setPassthrough({ pop: true, resetPrimary: true, showPrimary: false, filled: false }));
			m.addTrigger(new Trigger(90, ['doNow'], 'removeWhenTriggered'
				).setConsequences({ locked: false, goal: 0, velocity: 3.0, acceleration: -0.5 }));
		}

		this._animation.play();
	}

	id() 		{ return this._shape.id(); 	}
	name() 		{ return this._name; 		}
	event() 	{ return this._event; 		}
	eventArg() 	{ return this._eventArg; 	}
	shape() 	{ return this._shape; 		}
	selector() 	{ return this._selector; 	}
	ready() 	{ return this._ready; 		}
}