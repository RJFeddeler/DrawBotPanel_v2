'use strict';

class Mod {
	constructor(name, initialValue, settings) {
		this._name 				= name;
		this._locked 			= true;
		this._value 			= initialValue;
		this._goal 				= settings.goal 			|| 0.0;
		this._velocity 			= 0.0;
		this._acceleration 		= settings.acceleration 	|| 0.1;

		this._maxValue 			= settings.maxValue 		|| 999;
		this._minValue 			= settings.minValue 		|| -this._maxValue;
		this._dampen  			= settings.dampen 			|| 1.27;
		this._dampenZero 		= settings.dampenZero 		|| 0.1;

		this._velocityZero 		= settings.velocityZero 	|| 0.01;
		this._maxVelocity 		= settings.maxVelocity 		|| 50;
		this._minVelocity 		= settings.minVelocity 		|| -this._maxVelocity;

		this._triggers 			= [];
		this._history 			= [];

		this._atGoal			= settings.atGoal 			|| (this._value === this._goal ? true : false);
		this._passedGoal		= settings.passedGoal 		|| false;

		this._defaults 			= Object.assign({}, settings);

		return this;
	}

	update(positionData) {
		if (this._triggers.length < 1)
			return { name: this._name, value: this._goal, deleteMod: true };
		
		let t = this._triggers[this._triggers.length - 1];
		if (t.zIndex() >= (this._history.length * 100)) {
			var changes = t.check(this.data(), positionData);
			
			if (changes.deleteTrigger)
				this._triggers.pop();
		}

		this.setData(changes || {});

		var returnObj = { name: this._name, value: this._value };

		if (this._locked)
			return returnObj;

		if ((this._value > this._goal && this._acceleration > 0) || (this._value < this._goal && this._acceleration < 0)) {
			this._acceleration *= -1.0;
			this._velocity /= this._dampen;
		}

		this._velocity += this._acceleration;

		if (this._velocity > this._maxVelocity) 	{ this._velocity = this._maxVelocity;	}
		if (this._velocity < this._minVelocity) 	{ this._velocity = this._minVelocity;	}

		if ((changes && changes.velocity === undefined) && (this._value === this._goal) && (this._dampen > 1.0))
			this._velocity = 0.0;

		this._value += this._velocity;

		if (this._value > this._maxValue) 	{ this._value = this._maxValue; }
		if (this._value < this._minValue) 	{ this._value = this._minValue;	}

		if ((Math.abs(this._goal - this._value) < this._dampenZero) && (Math.abs(this._velocity) < this._velocityZero) && (this._dampen > 1.0))
			this._value = this._goal;

		this._passedGoal 	= (((returnObj.value < this._goal && this._value >= this._goal) || (returnObj.value > this._goal && this.value <= this._goal)) ? true : false);
		this._atGoal 		= (this._value === this._goal ? true : false);

		if (changes) {
			if (changes.showPrimary 	!== undefined) 	returnObj.showPrimary 	= changes.showPrimary;
			if (changes.resetPrimary	!== undefined) 	returnObj.resetPrimary 	= changes.resetPrimary;
			if (changes.filled 			!== undefined) 	returnObj.filled 		= changes.filled;
			if (changes.buttonShown 	!== undefined) 	returnObj.buttonShown 	= changes.buttonShown;
			if (changes.panelShown 		!== undefined) 	returnObj.panelShown 	= changes.panelShown;
			if (changes.deleteShape 	!== undefined) 	returnObj.deleteShape 	= changes.deleteShape;
			if (changes.pop 			!== undefined) 	this.pop();
		}

		returnObj.value = this._value;

		return returnObj;
	}

	push() {
		this._history.push({
			goal: 			this._defaults.goal,
			dampen: 		this._defaults.dampen,
			dampenZero: 	this._defaults.dampenZero,
			velocityZero: 	this._defaults.velocityZero,
			acceleration: 	this._defaults.acceleration });
		
		this._defaults.goal 		= this._goal;
		this._defaults.dampen 		= this._dampen;
		this._defaults.dampenZero 	= this._dampenZero;
		this._defaults.velocityZero = this._velocityZero;
		this._defaults.acceleration = this._acceleration;
	}

	pop() {
		if (this._history.length < 1)
			return;

		for (let i = this._triggers.length - 1; i >= 0; i--) {
			if (this._triggers[i].zIndex() >= (this._history.length * 100))
				this._triggers.pop();
		}

		this.setData( Object.assign( this._defaults, this._history.pop() ) );

		this._atGoal 		= this._value === this._goal ? true : false;
		this._passedGoal 	= this._atGoal;
	}

	addTrigger(trigger) {
		trigger.setZIndex(trigger.zIndex() + (this._history.length * 100));

		if (this._triggers.length === 0 || (trigger.zIndex() >= this._triggers[this._triggers.length - 1].zIndex()))
			this._triggers.push(trigger);

		return this;
	}

	data() {
		return {
			name: 			this._name,
			value: 			this._value,
			goal: 			this._goal,
			acceleration: 	this._acceleration,
			
			maxValue: 		this._maxValue,
			minValue: 		this._minValue,
			dampen: 		this._dampen,
			dampenZero: 	this._dampenZero,
			
			velocity: 		this._velocity,
			velocityZero: 	this._velocityZero,
			maxVelocity: 	this._maxVelocity,
			minVelocity: 	this._minVelocity,
			
			atGoal: 		this._atGoal,
			passedGoal: 	this._passedGoal
		};
	};

	setData(data) {
		var d = Object.keys(data);

		for (let i = 0; i < d.length; i++) {
			switch (d[i]) {
				case 'locked': 			this._locked 		= data.locked; 			break;
				case 'name': 			this._name 			= data.name; 			break;
				case 'value': 			this._value 		= data.value; 			break;
				case 'goal': 			this._goal 			= data.goal; 			break;
				case 'acceleration': 	this._acceleration 	= data.acceleration; 	break;
				case 'maxValue': 		this._maxValue 		= data.maxValue; 		break;
				case 'minValue': 		this._minValue 		= data.minValue; 		break;
				case 'dampen': 			this._dampen 		= data.dampen; 			break;
				case 'dampenZero': 		this._dampenZero 	= data.dampenZero; 		break;
				case 'velocity': 		this._velocity 		= data.velocity; 		break;
				case 'velocityZero': 	this._velocityZero 	= data.velocityZero; 	break;
				case 'maxVelocity': 	this._maxVelocity 	= data.maxVelocity; 	break;
				case 'minVelocity': 	this._minVelocity 	= data.minVelocity; 	break;
				default: break;
			}
		}
	}

	name() 	{ return this._name; }
	goal() 	{ return this._goal; }
}