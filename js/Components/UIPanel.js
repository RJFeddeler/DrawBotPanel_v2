'use strict';

class UIPanel {
	constructor(ctx, shape, name, radius, defaultContent) {
		this._ctx 				= ctx;
		this._shape 			= shape;
		this._name 				= name;

		this._ready 			= false;
		this._filling 			= false;
		this._content 			= [];
		this._defaultContent 	= defaultContent;

		var m = this._shape.getModByName('radius');
		if (!m)
			return;

		m.push();
		m.addTrigger(new Trigger(80, ['doNow']
			).setPassthrough({ panelShown: true }));
		m.addTrigger(new Trigger(80, ['doNow'], 'removeAtGoal'
			).setConsequences({ goal: radius, velocity: 1.0, acceleration: 0.5, dampen: 4.0, dampenZero: 9.0, velocityZero: 2.0 }
			).setPassthrough({ showPrimary: true, filled: true }));
		m.addTrigger(new Trigger(80, ['doNow'], 'removePassedGoal'
			).setConsequences({ goal: 0, locked: false, velocity: 0.5, acceleration: -0.25 }));
	}

	shown(panelContent) {
		if (panelContent)
			this._content = panelContent;

		this._ready = true;
	}

	update() {
		for (let i = 0; i < this._content.length; i++)
			this._content[i].update();
	}

	render() {
		if (!this._ready)
			return;

		this.draw(this._shape.x(), this._shape.y(), this._shape.radius());

		for (let i = 0; i < this._content.length; i++)
			this._content[i].render();
	}

	fillFrom(trigger) {
		this._fillSettings = {
			x: trigger.x,
			y: trigger.y,
			radius: trigger.radius,
			color: trigger.color,
			velocity: 5.0,
			acceleration: 0.7
		};

		this._filling = true;
	}

	showContent(name) {
		if (!this._ready)
			return;

		for (let i = 0; i < this._content.length; i++)
			if (this._content[i].name() === name) {
				if (this._shape.primaryColor() !== this._content[i].trigger().color)
					this.fillFrom(this._content[i].trigger());

				this._content[i].show();
			}
	}

	hideContent(name) {
		for (let i = 0; i < this._content.length; i++)
			if (this._content[i].name() === name)
				this._content[i].hide();
	}

	draw(x, y, radius) {
		var borderWidth = parseInt(radius / 40) + 1;

		if (radius <= (borderWidth * 2))
			return;

		if (this._filling) {
			var g = this._ctx.createRadialGradient(this._fillSettings.x, this._fillSettings.y, this._fillSettings.radius, this._fillSettings.x, this._fillSettings.y, this._fillSettings.radius + 1);
			g.addColorStop(0.5, this._fillSettings.color);
			g.addColorStop(0.5, this._shape.primaryColor());

			this._ctx.fillStyle = g;
			this._ctx.beginPath();
			this._ctx.arc(x, y, radius + 1, 0, 2 * Math.PI);
			this._ctx.closePath();
			this._ctx.fill();

			this._fillSettings.velocity += this._fillSettings.acceleration;
			this._fillSettings.radius 	+= this._fillSettings.velocity;

			var deltaX = (x - this._fillSettings.x),
				deltaY = (y - this._fillSettings.y);
			
			var buttonDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
			if (this._fillSettings.radius > (radius + buttonDistance)) {
				this._shape.setPrimary(this._fillSettings.color);
				this._filling = false;
			}
		}
	}

	delete() {
		this._ready = false;

		for (let i = 0; i < this._content.length; i++)
			this._content[i].delete();

		var m = this._shape.getModByName('radius');
		if (!m)
			return;

		m.addTrigger(new Trigger(90, ['doNow'], 'removeAtGoal'
			).setConsequences({ dampen: 1.75, dampenZero: 9.0, velocityZero: 2.0 }
			).setPassthrough({ pop: true, resetPrimary: true, showPrimary: false, filled: false }));
		m.addTrigger(new Trigger(90, ['doNow'], 'removePassedGoal'
			).setConsequences({ locked: false, goal: 0, velocity: 2.0, acceleration: -0.5 }));
	}

	id() 				{ return this._shape.id(); 		}
	name() 				{ return this._name; 			}
	shape() 			{ return this._shape; 			}
	ready() 			{ return this._ready; 			}
	radius() 			{ return this._shape.radius(); 	}
	content() 			{ return this._content; 		}
	defaultContent() 	{ return this._defaultContent; 	}
	showing() 			{ for (let i = 0; i < this._content.length; i++) if (this._content[i].showing()) return this._content[i].name(); }
}