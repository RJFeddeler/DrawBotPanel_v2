'use strict';

class Trigger {
	constructor(zIndex, trigger, autoDelete = 'never', invalidUntil = 'now', transparent = false) {
		this._zIndex 					= zIndex;
		this._trigger 					= trigger;

		this._primaryConsequences 		= {};
		this._secondaryConsequences 	= {};
		this._passthrough			 	= {};

		this._invalidUntil 				= invalidUntil;
		this._autoDelete 				= autoDelete;

		this.transparent 				= transparent;
		this._triggered 				= false;
		this._level 					= -1;
	}

	setPrimaryConsequences(consequences) 	{ this._primaryConsequences 	= consequences; }
	setSecondaryConsequences(consequences) 	{ this._secondaryConsequences 	= consequences; }
	setPassthrough(consequences) 			{ this._passthrough 			= consequences; }
	check(struct, positionData, atGoal = false, passedGoal = false) {
		var triggerLoopCheck = false;
		if (this._triggered) {
			triggerLoopCheck = true;

			if ((this._autoDelete === 'resetWhenTriggered') || (this._autoDelete === 'resetAtGoal' && atGoal) || (this._autoDelete === 'resetPassedGoal' && passedGoal))
				this._triggered = false;
			else if ((this._autoDelete === 'removeWhenTriggered') || (this._autoDelete  === 'removeAtGoal' && atGoal) || (this._autoDelete  === 'removePassedGoal' && passedGoal))
				return { deleteTrigger: true };
			else
				return this._secondaryConsequences;
		}

		if (!this._triggered) {
			if (this._invalidUntil !== 'now') {
				if 	((this._invalidUntil === 'atGoal' 		&& atGoal) 		|| 
					(this._invalidUntil === 'passedGoal' 	&& passedGoal)) {

						this._invalidUntil = 'now';
				}
				else if (this._invalidUntil instanceof Date && !isNaN(this._invalidUntil.valueOf())) {
					var now = new Date();
					if ((now - this._invalidUntil) > 0)
						this._invalidUntil = 'now';
				}
			}
			else {
				switch (this._trigger[0]) {
	  				case 'doNow':
	  					this._triggered = true;
	  					break;
	  				case 'mouseXY':
	  					var now = new Date();
	  					if (now - $lastMouseMove > 50)
	  						break;

	  					var distance = this._distanceBetween(positionData.position, positionData.mousePosition);

	  					if ((this._trigger[1] === '<' && distance < this._trigger[2]) || 
	  						(this._trigger[1] === '>' && distance > this._trigger[2]) || 
	  						(this._trigger[1] === 'isIn' && positionData.mouseIn)) {

	  						this._triggered = true;
	  					}
	  					break;
	  				case 'atGoal':
	  					if (atGoal)
	  						this._triggered = true;
	  					break;
	  				case 'passedGoal':
	  					if (passedGoal)
	  						this._triggered = true;
	  					break;
	  				case 'value':
	  				case 'velocity':
	  					var test = this._getNumberOrValue(this._trigger[2], struct);

	  					if (isNaN(test))
	  						break;

	  					var tester;
	  					if 		(this._trigger[0] === 'value') 		{ tester = struct.value; 	}
	  					else if (this._trigger[0] === 'velocity') 	{ tester = struct.velocity; }
	  					else 										{ break; 					}

	  					if (((this._trigger[1] === '!=') && (tester !== test)) || 
	  						((this._trigger[1] === '<')  && (tester <   test)) || 
	  						((this._trigger[1] === '<=') && (tester <=  test)) || 
	  						((this._trigger[1] === '>')  && (tester >   test)) || 
	  						((this._trigger[1] === '>=') && (tester >=  test)) || 
	  						((this._trigger[1] === '=')  && (tester === test)))

	  						this._triggered = true;

	  					break;
	  				default:
	  					break;
	  			}

				if (this._triggered && !triggerLoopCheck)
					return Object.assign({}, this._primaryConsequences, this._secondaryConsequences, this._passthrough);
				else if (this._triggered)
					return this._secondaryConsequences;
			}
		}

		return {};
	}

	_distanceBetween(point1, point2) {
		var delta = { x: (point1.x - point2.x), y: (point1.y - point2.y) };

  		return Math.sqrt(delta.x * delta.x + delta.y * delta.y);
  	}

	_getNumberOrValue(item, struct) {
  		if (isFinite(item)) 				{	return Number(item);			}
		else if (item === 'value') 			{ 	return struct.value;			}
		else if (item === 'goal') 			{ 	return struct.goal;				}
		else if (item === 'acceleration') 	{ 	return struct.acceleration;		}
		else if (item === 'velocity') 		{ 	return struct.velocity;			}
		else if (item === 'minVelocity') 	{ 	return struct.minVelocity;		}
		else if (item === 'maxVelocity') 	{ 	return struct.maxVelocity;		}
		else if (item === 'dampen') 		{ 	return struct.dampen;			}
		else if (item === 'dampenZero') 	{ 	return struct.dampenZero;		}

		return NaN;
  	}

  	static funcSort(a, b) {
		if (a._zIndex === b._zIndex) {
			var aVal = (a._invalidUntil === 'now' ? 0 : (a._invalidUntil === 'atGoal' ? 999 : (a._invalidUntil === 'passedGoal' ? 998 : a._invalidUntil.getTime())));
			var bVal = (b._invalidUntil === 'now' ? 0 : (b._invalidUntil === 'atGoal' ? 999 : (b._invalidUntil === 'passedGoal' ? 998 : b._invalidUntil.getTime())));

			if (aVal === bVal) {
				if (a.transparent && !b.transparent) return 1;
				else if (!a.transparent && b.transparent) return -1;
				else return 0;
			} else return aVal > bVal;
		} else return a._zIndex > b._zIndex;
	}

	get level() { 		return this._level; 	}
	set level(value) { 	this._level = value; 	}
}