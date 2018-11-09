'use strict';

class UIPanel {
	constructor(name, shape, radius, canvasTop, canvasWidth, canvasHeight) {
		this._name 			= name;
		this._shape 		= shape;
		this._content 		= [];

		this._contentPos = {
			left: 	Math.max( shape.x() - radius, 0 ),
			right: 	Math.min( shape.x() + radius, canvasWidth ),
			top: 	Math.max( shape.y() - radius, 0 ) + canvasTop,
			bottom: Math.min( shape.y() + radius, canvasHeight ) + canvasTop
		};

		this._contentPos.width = this._contentPos.right - this._contentPos.left;
		this._contentPos.height = this._contentPos.bottom - this._contentPos.top;

		var m = this._shape.getModByName('radius');
		if (!m)
			return;

		m.push();
		m.addTrigger(new Trigger(80, ['doNow']
			).setPassthrough({ panelShown: this }));
		m.addTrigger(new Trigger(80, ['doNow'], 'removeAtGoal'
			).setConsequences({ goal: radius, velocity: 1.0, acceleration: 0.5, dampen: 4.0, dampenZero: 9.0, velocityZero: 2.0 }
			).setPassthrough({ showPrimary: true, filled: true }));
		m.addTrigger(new Trigger(80, ['doNow'], 'removePassedGoal'
			).setConsequences({ goal: 0, locked: false, velocity: 0.5, acceleration: -0.25 }));

		this.element = new UIElement('div', 'UIPanel'
			).setStyle( 'width', 	this._contentPos.width
			).setStyle( 'height', 	this._contentPos.height
			).setStyle( 'left', 	this._contentPos.left
			).setStyle( 'top', 		this._contentPos.top
			).appendTo( document.body
		);
	}

	addContent(content) {
		this._content = content;
	}

	getLinkRequests() {
		var linkRequests = [];

		for (let i = 0; i < this._content.length; i++) {
			let r = this._content[i].linkReqs();
			for (let j = 0; j < r.length; j++)
				linkRequests.push( { source: this._content[i], dest: r[j] });
		}

		return linkRequests;
	}

	update() {
		if (!Array.isArray(this._content))
			return;

		for (let i = 0; i < this._content.length; i++)
			this._content[i].update();
	}

	showDefaultContent() {
		if (this._content.length > 0)
			this._content[0].show();
	}

	showContent(name) {
		for (let i = 0; i < this._content.length; i++)
			if (this._content[i].name() === name)
				this._content[i].show();
	}

	hideContent(name) {
		for (let i = 0; i < this._content.length; i++)
			if (this._content[i].name() === name)
				return this._content[i].hide();
	}

	remove() {
		for (let i = 0; i < this._content.length; i++) {
			this._content[i].remove();
		}

		this.element.remove();

		var m = this._shape.getModByName('radius');
		if (!m)
			return;

		m.addTrigger(new Trigger(90, ['doNow'], 'removeAtGoal'
			).setConsequences({ dampen: 1.75, dampenZero: 9.0, velocityZero: 2.0 }
			).setPassthrough({ pop: true, resetPrimary: true, showPrimary: false, filled: false }));
		m.addTrigger(new Trigger(90, ['doNow'], 'removePassedGoal'
			).setConsequences({ locked: false, goal: 0, velocity: 2.0, acceleration: -0.49 }));
	}

	name() 		{ return this._name; 	}
	shape() 	{ return this._shape; 	}
	content() 	{ return this._content; }
	active() 	{ for (let i = 0; i < this._content.length; i++) if (this._content[i].active()) return this._content[i].name(); }
}