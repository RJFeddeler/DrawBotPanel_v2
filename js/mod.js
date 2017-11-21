class Mod {
	constructor(name, settings) {
		this._name 				= name;
		this._value 			= settings.value 			|| 0.0;
		this._goal 				= settings.goal 			|| 0.0;
		this._acceleration 		= settings.acceleration 	|| 0.1;

		this._maxValue 			= settings.maxValue 		|| 999;
		this._minValue 			= settings.minValue 		|| -this._maxValue;
		this._dampen  			= settings.dampen 			|| 1.27;
		this._dampenZero 		= settings.dampenZero 		|| 0.1;

		this._velocity 			= settings.velocity 		|| 0.0;
		this._velocityZero 		= settings.velocityZero 	|| 0.01;
		this._maxVelocity 		= settings.maxVelocity 		|| 50;
		this._minVelocity 		= settings.minVelocity 		|| -this._maxVelocity;

		this._atGoal			= settings.atGoal 			|| (this._value === this._goal ? true : false);
		this._passedGoal		= settings.passedGoal 		|| false;

		this._locked 			= settings.locked 			|| false;
		this._triggers 			= [];
		this._goalHistory 		= [];
		this._triggerLevel 		= 0;

		this._defaults 			= {};
		this.defaults 			= settings;
	}

	update(positionData) {
		if (this._triggers.length > 1)
			this._triggers.sort(Trigger.funcSort);

		var changes = {};
		for (var i = this._triggers.length - 1; i >= 0; i--) {
			var result = this._triggers[i].check(this.struct, positionData, this._atGoal, this._passedGoal);
			var cut = false;
			
			if (result.deleteTrigger) {
				this._triggers.splice(i, 1);
				cut = true;

				if (this._triggers.length === 0)
					return { name: this._name, value: this._goal, deleteMod: true };
			}
				
			this.addChanges(changes, result);

			if (!cut && !this._triggers[i].transparent)
				break;
		}

		if (Object.keys(changes).length === 0 || (Object.keys(changes).length === 1 && Object.keys(changes)[0] === 'deleteTrigger'))
			this.struct = this._defaults;
		else
			this.struct = changes;

		if (this._locked)
			return { name: this._name, value: this._value };

		var before = this._value;

		if ((this._value > this._goal && this._acceleration > 0) || (this._value < this._goal && this._acceleration < 0)) {
			this._acceleration *= -1.0;
			this._velocity /= this._dampen;
		}

		this._velocity += this._acceleration;

		if (this._velocity > this._maxVelocity) 	{ this._velocity = this._maxVelocity;	}
		if (this._velocity < this._minVelocity) 	{ this._velocity = this._minVelocity;	}

		if ((changes.velocity === undefined) && (this._value === this._goal) && (this._dampen > 1.0))
			this._velocity = 0.0;

		this._value += this._velocity;

		if (this._value > this._maxValue) 	{ this._value = this._maxValue; }
		if (this._value < this._minValue) 	{ this._value = this._minValue;	}

		if ((Math.abs(this._goal - this._value) < this._dampenZero) && (Math.abs(this._velocity) < this._velocityZero))
			this._value = this._goal;

		if ((before < this._goal && this._value >= this._goal) || (before > this._goal && this.value <= this._goal))
			this._passedGoal = true;
		else
			this._passedGoal = false;

		this._atGoal = (this._value === this._goal ? true : false);

		var returnObj = { name: this._name, value: this._value };

		if (result.showPrimaryColor !== undefined)
			Object.assign(returnObj, { showPrimaryColor: result.showPrimaryColor });
		if (result.filled !== undefined)
			Object.assign(returnObj, { filled: result.filled });
		if (result.buttonShown !== undefined)
			Object.assign(returnObj, { buttonShown: result.buttonShown });
		if (result.deleteCircle)
			Object.assign(returnObj, { deleteCircle: result.deleteCircle });
		if (result.pushGoal)
			this.pushGoal();
		if (result.popGoal)
			this.popGoal();

		return returnObj;
	}

	pushGoal() {
		this._goalHistory.push(this._defaults.goal);
		this.defaults = { goal: this._goal };
	}

	popGoal() {
		for (var i = 0; i < this._triggers.length; i++)
			if (this._triggers[i].level === this._triggerLevel)
				this._triggers.splice(i--, 1);

		this._triggerLevel--;

		this.defaults = { goal: this._goalHistory.pop() };
		this._goal = this._defaults.goal;
		this._passedGoal = false;
		this._atGoal = (this._value === this._goal ? true : false);
	}

	addTrigger(trigger) 	{
		if (trigger._passthrough.pushGoal)
			this._triggerLevel++;

		trigger.level = this._triggerLevel;
		this._triggers.push(trigger);

		return (this._triggers.length - 1);
	}

	get name() 				{ return this._name; }

	get locked() 			{ return this._locked; }
	set locked(value) 		{ this._locked = (value ? true : false); }

	get value() 			{ return this._value; }
	set value(value) 		{ this._value = value; }

	get goal() 				{ return this._goal; }
	set goal(value) 		{ this._goal = value; }

	get velocity() 			{ return this._velocity; }
	set velocity(value) 	{ this._velocity = value; }

	get acceleration() 		{ return this._acceleration; }
	set acceleration(value) { this._acceleration = value; }

	get dampen() 			{ return this._dampen; }
	set dampen(value) 		{ this._dampen = value; }

	get dampenZero() 		{ return this._dampenZero; }
	set dampenZero(value) 	{ this._dampenZero = value; }

	get minVelocity() 		{ return this._minVelocity; }
	set minVelocity(value) 	{ this._minVelocity = value; }

	get triggerCount() 		{ return this._triggers.length; }

	get defaults() 			{ return this._defaults; }
	set defaults(settings) 	{
		var s = Object.keys(settings);
		for (var i = 0; i < s.length; i++) {
			switch (s[i]) {
				case 'goal': 			this._defaults.goal 		= settings.goal; 			break;
				case 'acceleration': 	this._defaults.acceleration = settings.acceleration; 	break;
				case 'maxValue': 		this._defaults.maxValue 	= settings.maxValue; 		break;
				case 'minValue': 		this._defaults.minValue 	= settings.minValue; 		break;
				case 'dampen': 			this._defaults.dampen 		= settings.dampen; 			break;
				case 'dampenZero': 		this._defaults.dampenZero 	= settings.dampenZero; 		break;
				case 'velocityZero': 	this._defaults.velocityZero = settings.velocityZero; 	break;
				case 'maxVelocity': 	this._defaults.maxVelocity 	= settings.maxVelocity; 	break;
				case 'minVelocity': 	this._defaults.minVelocity 	= settings.minVelocity; 	break;
				default: break;
			}
		}
	}

	get struct() 			{
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

	set struct(struct) {
		var s = Object.keys(struct);

		for (var i = 0; i < s.length; i++) {
			switch (s[i]) {
				case 'locked': 			this._locked 		= struct.locked; 		break;
				case 'name': 			this._name 			= struct.name; 			break;
				case 'value': 			this._value 		= struct.value; 		break;
				case 'goal': 			this._goal 			= struct.goal; 			break;
				case 'acceleration': 	this._acceleration 	= struct.acceleration; 	break;
				case 'maxValue': 		this._maxValue 		= struct.maxValue; 		break;
				case 'minValue': 		this._minValue 		= struct.minValue; 		break;
				case 'dampen': 			this._dampen 		= struct.dampen; 		break;
				case 'dampenZero': 		this._dampenZero 	= struct.dampenZero; 	break;
				case 'velocity': 		this._velocity 		= struct.velocity; 		break;
				case 'velocityZero': 	this._velocityZero 	= struct.velocityZero; 	break;
				case 'maxVelocity': 	this._maxVelocity 	= struct.maxVelocity; 	break;
				case 'minVelocity': 	this._minVelocity 	= struct.minVelocity; 	break;
				default: break;
			}
		}
	}

	addChanges(oldChanges, newChanges) {
		var changes = Object.keys(newChanges);

		for (var i = 0; i < changes.length; i++) {
			if (newChanges.relativeValue === 'value')
				newChanges.relativeValue = this._value;
			if (newChanges.relativeGoal === 'value')
				newChanges.relativeGoal = this._value;

			switch (changes[i]) {
				case 'locked': 			if (oldChanges.locked 		=== undefined) 	oldChanges.locked 		= newChanges.locked; 		break;
				case 'value': 			if (oldChanges.value 		=== undefined) 	oldChanges.value 		= newChanges.value; 		break;
				case 'relativeValue': 	if (oldChanges.value 		=== undefined) 	oldChanges.value 		-= newChanges.value;		break;
				case 'goal': 			if (oldChanges.goal 		=== undefined) 	oldChanges.goal 		= newChanges.goal; 			break;
				case 'relativeGoal': 	if (oldChanges.goal 		=== undefined) 	oldChanges.goal 		-= newChanges.goal;			break;
				case 'velocity': 		if (oldChanges.velocity 	=== undefined) 	oldChanges.velocity 	= newChanges.velocity; 		break;
				case 'acceleration': 	if (oldChanges.acceleration === undefined) 	oldChanges.acceleration = newChanges.acceleration; 	break;
				case 'maxValue': 		if (oldChanges.maxValue 	=== undefined) 	oldChanges.maxValue 	= newChanges.maxValue; 		break;
				case 'minValue': 		if (oldChanges.minValue 	=== undefined) 	oldChanges.minValue 	= newChanges.minValue; 		break;
				case 'dampen': 			if (oldChanges.dampen 		=== undefined) 	oldChanges.dampen 		= newChanges.dampen; 		break;
				case 'dampenZero': 		if (oldChanges.dampenZero 	=== undefined) 	oldChanges.dampenZero 	= newChanges.dampenZero; 	break;
				case 'velocityZero': 	if (oldChanges.velocityZero === undefined) 	oldChanges.velocityZero = newChanges.velocityZero; 	break;
				case 'maxVelocity': 	if (oldChanges.maxVelocity 	=== undefined) 	oldChanges.maxVelocity 	= newChanges.maxVelocity; 	break;
				case 'minVelocity': 	if (oldChanges.minVelocity 	=== undefined) 	oldChanges.minVelocity 	= newChanges.minVelocity; 	break;
				default: break;
			}
		}
	}
}