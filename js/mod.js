class Mod {
	constructor(name, settings) {
		this._name = name;
		this._value = settings.start || 0.0;
		this._goal = settings.goal || 0.0;
		this._accel = settings.accel || 0.1;

		this._maxValue = settings.maxValue || 999;
		this._dampen  = settings.dampen || 1.27;
		this._dampenLimit = settings.dampenLimit || 0.1;
		this._velocity = settings.startVelocity || 0.0;
		this._minVelocity = settings.minVelocity || 0.01;
		this._maxVelocity = settings.maxVelocity || 50;

		this._locked = settings.locked || false;
		this._enabled = settings.enabled || true;
		this._finishedAnimation = settings.finishedAnimation || true;
		this._triggers = [];
		this._history = [];
	}

	addTrigger(event, consequences, autoDelete = false) {
		if (DEBUG_VERBOSE) { console.log("addTrigger"); }
		var trigger = { event: event, consequences: consequences, autoDelete: autoDelete };
		this._triggers.push(trigger);

		return this._triggers.length - 1;
	}

	setTrigger(id, event, consequences, autoDelete = false) {
		if (DEBUG_VERBOSE) { console.log("setTrigger"); }
		if (id >= this.triggerCount)
			return;

		this._triggers[id] = { event: event, consequences: consequences, autoDelete: autoDelete };
	}

	removeTriggerById(id) {
		if (DEBUG_VERBOSE) { console.log("removeTriggerById"); }
		if (id >= this._triggers.length)
			return;

		this._triggers[id] = { event: 'removed', consequences: 'none', autoDelete: false };
	}

	push() {
		if (DEBUG_VERBOSE) { console.log("push"); }
		var state = {
			value: this._value,
			goal: this._goal,
			accel: this._accel,
			maxValue: this._maxValue,
			velocity: this._velocity,
			minVelocity: this._minVelocity,
			maxVelocity: this._maxVelocity,
			dampen: this._dampen,
			dampenLimit: this._dampenLimit,
			finishedAnimation: this._finishedAnimation,
			locked: this._locked,
			enabled: this._enabled,
			triggers: this._triggers };

			this._history.push(state);
	}

	pop() {
		if (DEBUG_VERBOSE) { console.log("pop"); }
		if (this._history.length > 0) {
			var state = this._history.splice(0, 1)[0];

			//this._value = state.value;
			this._goal = state.goal;
			this._accel = state.accel;
			this._maxValue = state.maxValue;
			//this._velocity = state.velocity;
			this._minVelocity = state.minVelocity;
			this._maxVelocity = state.maxVelocity;
			this._dampen = state.dampen;
			this._dampenLimit = state.dampenLimit;
			//this._finishedAnimation = state.finishedAnimation;
			//this._locked = state.locked;
			//this._enabled = state.enabled;
			this._triggers = state.triggers;
		}
	}

	setModSettings(modStruct) {
		if (modStruct.value != undefined) { this._value = modStruct.value; }
		if (modStruct.goal != undefined) { this._goal = modStruct.goal; }
		if (modStruct.accel != undefined) { this._accel = modStruct.accel; }
		if (modStruct.dampen != undefined) { this._dampen = modStruct.dampen; }
		if (modStruct.dampenLimit != undefined) { this._dampenLimit = modStruct.dampenLimit; }
		if (modStruct.maxValue != undefined) { this._maxValue = modStruct.maxValue; }
		if (modStruct.velocity != undefined) { this._velocity = modStruct.velocity; }
		if (modStruct.minVelocity != undefined) { this._minVelocity = modStruct.minVelocity; }
		if (modStruct.maxVelocity != undefined) { this._maxVelocity = modStruct.maxVelocity; }
		if (modStruct.finishedAnimation != undefined) { this._finishedAnimation = modStruct.finishedAnimation; }
		if (modStruct.locked != undefined) { this._locked = modStruct.locked; }
		if (modStruct.enabled != undefined) { this._enabled = modStruct.enabled; }
		if (modStruct.triggers != undefined) { this._triggers = modStruct.triggers; }
	}

	update() {									///////// CAN I COMBINE ENABLED AND LOCKED?
		if (DEBUG_VERBOSE) { console.log("mod update"); }
		if (this._locked || !this._enabled)
			return;

		var before = this._value;

		if ((this._value > this._goal && this._accel > 0) || (this._value < this._goal && this._accel < 0)) {
			this._changeDirection();
			this._velocity /= this._dampen;
		}

		this._velocity += this._accel;

		if (this._velocity > this._maxVelocity) 	{ this._velocity = this._maxVelocity;	}
		if (this._velocity < -this._maxVelocity) 	{ this._velocity = -this._maxVelocity;	}

		this._value += this._velocity;

		if (this._value > this._maxValue) 	{ this._value = this._maxValue; 	}
		if (this._value < -this._maxValue) 	{ this._value = -this._maxValue;	}

		if ((Math.abs(this._goal - this._value) <= this._dampenLimit) && (Math.abs(this._velocity) <= this._minVelocity)) {
			this._value = this._goal;
			this._enabled = false;

			this._finishedAnimation = true;

			for (var i = 0; i < this._triggers.length; i++) {
				if (this._triggers[i].autoDelete === 'whenDone')
					this.removeTriggerById(i);
			}
		}
	}

	_changeDirection() { this._accel *= -1.0; }

	get name() { return this._name; }

	get enabled() { return this._enabled; }
	set enabled(value) { this._enabled = (value ? true : false); }
	
	get locked() { return this._locked; }
	set locked(value) { this._locked = (value ? true : false); }

	get value() { return this._value; }
	set value(value) { this._value = value; }

	get goal() { return this._goal; }
	set goal(value) { this._goal = value; }

	get velocity() { return this._velocity; }
	set velocity(value) { this._velocity = value; }

	get dampen() { return this._dampen; }
	set dampen(value) { this._dampen = value; }

	get dampenLimit() { return this._dampenLimit; }
	set dampenLimit(value) { this._dampenLimit = value; }

	get minVelocity() { return this._minVelocity; }
	set minVelocity(value) { this._minVelocity = value; }

	get finishedAnimation() { return this._finishedAnimation; }
	set finishedAnimation(value) { this._finishedAnimation = (value ? true : false); }

	get triggerCount() { if (DEBUG_VERBOSE) { console.log("triggerCount"); } return this._triggers.length; }

	getTrigger(index) { if (DEBUG_VERBOSE) { console.log("getTrigger"); } return this._triggers[index].event; }
	getConsequences(index) { if (DEBUG_VERBOSE) { console.log("getConsequences"); } return this._triggers[index].consequences; }
	getAutoDelete(index) { if (DEBUG_VERBOSE) { console.log("autoDelete"); } return this._triggers[index].autoDelete; }
}