'use strict';

class Trigger {
	constructor(zIndex, trigger, autoDelete, invalidUntil) {
		this._trigger 			= trigger;

		this._consequences 		= {};
		this._passthrough		= {};

		this._invalidUntil 		= invalidUntil 	|| 'now';
		this._autoDelete 		= autoDelete 	|| 'never';

		this._triggered 		= false;
		this._zIndex 			= zIndex;

		return this;
	}

	zIndex() 		{ return this._zIndex; 	}
	setZIndex(val) 	{ this._zIndex = val; 	}

	setConsequences(consequences) 	{ this._consequences 	= consequences; return this; 	}
	setPassthrough(consequences) 	{ this._passthrough 	= consequences; return this;	}

	check(data, positionData) {
		if (this._triggered) {
			if ((this._autoDelete === 'removeWhenTriggered') ||
				(this._autoDelete === 'removeAtGoal' && data.atGoal) ||
				(this._autoDelete === 'removePassedGoal' && data.passedGoal))
			{
				return { deleteTrigger: true };
			}

			if ((this._autoDelete === 'resetWhenTriggered') ||
				(this._autoDelete === 'resetAtGoal' 			&& data.atGoal) ||
				(this._autoDelete === 'resetPassedGoal' 		&& data.passedGoal) ||
				(this._autoDelete === 'resetOnMouseOut' 		&& !this._distanceCheck(positionData)) ||
				(this._autoDelete === 'resetOnMouseOutAtGoal' 	&& data.atGoal && !this._distanceCheck(positionData)))
			{
				this._triggered = false;
			}

			return {};
		}

		if (!this._triggered) {
			if (this._invalidUntil !== 'now') {
				if 	((this._invalidUntil === 'atGoal' && data.atGoal) || (this._invalidUntil === 'passedGoal' && data.passedGoal)) {
					this._invalidUntil = 'now';
				}
				else if (this._invalidUntil instanceof Date && !isNaN(this._invalidUntil.valueOf())) {
					if ((new Date().getTime() - this._invalidUntil) > 0)
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
	  					if (now - mouse.lastUpdate() > 50)
	  						break;

	  					if (this._distanceCheck(positionData))
	  						this._triggered = true;

	  					break;
	  				case 'atGoal':
	  					if (data.atGoal) 		{ this._triggered = true; } break;
	  				case 'passedGoal':
	  					if (data.passedGoal) 	{ this._triggered = true; } break;
	  				case 'value':
	  				case 'velocity':
	  					var test = this._getNumberOrValue(this._trigger[2], data);

	  					if (isNaN(test))
	  						break;

	  					var tester;
	  					if 		(this._trigger[0] === 'value') 		{ tester = data.value; 		}
	  					else if (this._trigger[0] === 'velocity') 	{ tester = data.velocity; 	}
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

				if (this._triggered)
					return Object.assign({}, this._consequences, this._passthrough);
			}
		}

		return {};
	}

	_getNumberOrValue(item, data) {
  		if (isFinite(item))
  			return Number(item);

  		switch (item) {
  			case 'value': 			return data.value;
  			case 'goal': 			return data.goal;
  			case 'acceleration': 	return data.acceleration;
  			case 'velocity': 		return data.velocity;
  			case 'minVelocity': 	return data.minVelocity;
  			case 'maxVelocity': 	return data.maxVelocity;
  			case 'dampen': 			return data.dampen;
  			case 'dampenZero': 		return data.dampenZero;
  			default: 				return NaN;
  		}
  	}

  	_distanceCheck(positionData) {
  		if ((this._trigger[1] === 'isNear') && positionData.mouseNear)
  			return true;
  		
  		if ((this._trigger[1] === 'isIn') 	 && positionData.mouseIn)
  			return true;

  		return false;
  	}
}