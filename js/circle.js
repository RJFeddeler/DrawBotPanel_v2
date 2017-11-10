class Circle {
	constructor(x, y, radius) {
		this._x = x;
	 	this._y = y;
	 	this._radius = radius;
	 	this._xOffset = 0;
	 	this._yOffset = 0;

	 	this._showPrimaryColor = false;
	 	this._primaryColor = '#000000';
	 	this._fillColor = '#000000';
	 	this._filled = false;
	 	this._opacity = 1.0;
	 	this._borderWidth = 1;

	 	this._isButton = false;
	 	this._font = '';
	 	this._text = '';
	 	this._mouseIn = false;

	 	this._mods = [];
	}

  	addMod(name, modStruct) {
  		if (DEBUG_VERBOSE) { console.log("addMod"); }
  		var mod = new Mod(name, modStruct);
  		this._mods.push(mod);

  		return this._mods.length - 1;
  	}

  	addTriggerToMod(mod, event, consequences, autoDelete = false) {
  		if (DEBUG_VERBOSE) { console.log("addTriggerToMod"); }
  		var id = this._findRemovedTrigger(mod);

  		if (id < 0)
  			return this._mods[mod].addTrigger(event, consequences, autoDelete);
  		else {
  			this._mods[mod].setTrigger(id, event, consequences, autoDelete);
  			return id;
  		}
  	}

  	removeTriggerFromMod(mod, event) {
  		if (mod < this._mods.length)
  			this._mods[mod].removeTriggerByEvent(event);
  	}

  	_findRemovedTrigger(mod) {
  		if (DEBUG_VERBOSE) { console.log("_findRemovedTrigger"); }
  		for (var i = 0; i < this._mods[mod].triggerCount; i++) {
  			if (this._mods[mod].trigger === 'removed')
  				return i;
  		}

  		return -1;
  	}

  	getModId(name) {
  		if (DEBUG_VERBOSE) { console.log('getModId'); }
  		for (var i = 0; i < this._mods.length; i++) {
  			if (this._mods[i].name === name)
  				return i;
  		}

  		return -1;
  	}

  	_getNumberOrValue(check, mod) {
  		if (DEBUG_VERBOSE) { console.log("_getNumberOrValue"); }
  		if (isFinite(check)) 				{	return Number(check);					}
		else if (check === 'value') 		{ 	return this._mods[mod].value;			}
		else if (check === 'goal') 			{ 	return this._mods[mod].goal;			}
		else if (check === 'velocity') 		{ 	return this._mods[mod].velocity;		}
		else if (check === 'acceleration') 	{ 	return this._mods[mod].acceleration;	}
		else if (check === 'minVelocity') 	{ 	return this._mods[mod].minVelocity;		}
		else if (check === 'dampen') 		{ 	return this._mods[mod].dampen;			}
		else if (check === 'dampenLimit') 	{ 	return this._mods[mod].dampenLimit;		}

		return NaN;
  	}

  	_distanceTo(x, y) {
  		var deltaX = this._x - x;
  		var deltaY = this._y - y;

  		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  	}

  	_perform(mod, actions) {
  		if (DEBUG_VERBOSE) { console.log("_perform"); }
  		if (!Array.isArray(actions))
  			return;

  		if (!Array.isArray(actions[0]))
  			actions = [ actions ];

  		for (var i = 0; i < actions.length; i++) {
  			if (this._mods[mod].locked && actions[i][0] !== 'unlock')
  				continue;

  			switch (actions[i][0]) {
  				case 'unlock': this._mods[mod].locked = false; break;
  				case 'lock': this._mods[mod].locked = true; break;
  				case 'push': this._mods[mod].push(); break;
  				case 'pop': this._mods[mod].pop(); break;
  				case 'addTrigger':
  					var d = (actions[i].length > 3) ? actions[i][3] : false;
  					this.addTriggerToMod(mod, actions[i][1], actions[i][2], d);
  					break;
  				case 'set':
  					var source = this._getNumberOrValue(actions[i][2], mod);

  					if (actions[i][1] === 'showPrimaryColor')
  						this._showPrimaryColor = (source ? true : false);
  					else if (actions[i][1] === 'filled')
  						this._filled = (source ? true : false);
  					else if (actions[i][1] === 'isButton')
  						this._isButton = (source ? true : false);
  					else if (actions[i][1] === 'font')
  						this._font = source;
  					else if (actions[i][1] === 'text')
  						this._text = source;
  					else {
	  					if (isNaN(source)) { break; }

	  					this._mods[mod].enabled = true; /////////////////// ???
	  					switch (actions[i][1]) {
	  						case 'value': 			this._mods[mod].value 			= source; break;
	  						case 'goal': 			this._mods[mod].goal 			= source; break;
	  						case 'velocity': 		this._mods[mod].velocity 		= source; break;
	  						case 'acceleration': 	this._mods[mod].acceleration	= source; break;
	  						case 'minVelocity': 	this._mods[mod].minVelocity		= source; break;
	  						case 'dampen': 			this._mods[mod].dampen			= source; break;
	  						case 'dampenLimit': 	this._mods[mod].dampenLimit		= source; break;
	  						default: break;
	  					}
	  				}
  					break;
  				case 'multiply':
  					var source = this._getNumberOrValue(actions[i][2], mod);
  					if (isNaN(source))
  						break;

  					this._mods[mod].enabled = true; /////////////////// ???
  					switch (actions[i][1]) {
  						case 'value': 			this._mods[mod].value 			*= source; break;
  						case 'goal': 			this._mods[mod].goal 			*= source; break;
  						case 'velocity': 		this._mods[mod].velocity 		*= source; break;
  						case 'acceleration': 	this._mods[mod].acceleration	*= source; break;
  						case 'minVelocity': 	this._mods[mod].minVelocity		*= source; break;
  						case 'dampen': 			this._mods[mod].dampen			*= source; break;
  						case 'dampenLimit': 	this._mods[mod].dampenLimit		*= source; break;
  						default: break;
  					}
  					break;
  				default: break;
  			}
  		}
  	}

  	_checkMods() {
  		if (DEBUG_VERBOSE) { console.log("_checkMods"); }
  		for (var i = 0; i < this._mods.length; i++) {
  			for (var j = 0; j < this._mods[i].triggerCount; j++) {
  				
  				var trig = this._mods[i].getTrigger(j);
  				if (!Array.isArray(trig)) { trig = [ trig ]; };
  				var autoDel = false;

	  			switch (trig[0]) {
	  				case 'removed':
	  					break;
	  				case 'doAfter':
	  					var now = new Date();
	  					if (now - trig[1] >= trig[2]) {
	  						this._perform(i, this._mods[i].getConsequences(j));
	  						autoDel = this._mods[i].getAutoDelete(j);
	  					}
	  					break;
	  				case 'doNow':
	  					this._perform(i, this._mods[i].getConsequences(j));
	  					autoDel = this._mods[i].getAutoDelete(j);
	  					
	  					break;
	  				case 'mouseXY':
	  					var now = new Date();
	  					if (now - $lastMouseMove > 500)
	  						break;

	  					var distance = this._distanceTo($mouseX, $mouseY);
	  					if ((trig[1] === '<' && distance < trig[2]) || (trig[1] === '>' && distance > trig[2])) {
	  						this._perform(i, this._mods[i].getConsequences(j));
	  						autoDel = this._mods[i].getAutoDelete(j);
	  					}

	  					break;
	  				case 'atGoal':
	  					if (this._mods[i].value === this._mods[i].goal) {
	  						this._perform(i, this._mods[i].getConsequences(j));
	  						autoDel = this._mods[i].getAutoDelete(j);
	  						if (autoDel === 'whenDone' || autoDel === 'whenTriggered')
	  							this._mods[i].removeTriggerById(j);
	  					}
	  					break;
	  				case 'value':
	  					var test = this._getNumberOrValue(trig[2], i);
	  					if (isNaN(test))
	  						break;

	  					if (((trig[1] === '!=') && (this._mods[i].value !== test)) || 
	  						((trig[1] === '<') && (this._mods[i].value < test)) || 
	  						((trig[1] === '>') && (this._mods[i].value > test)) || 
	  						((trig[1] === '=') && (this._mods[i].value === test))) {

	  						this._perform(i, this._mods[i].getConsequences(j));
	  						autoDel = this._mods[i].getAutoDelete(j);
	  					}
	  					break;
	  				default:
	  					break;
	  			}

	  			if (autoDel === 'whenTriggered')
	  				this._mods[i].removeTriggerById(j);
	  		}

	  		if (this._mods[i].enabled) {
		  		this._mods[i].update();
		  		switch (this._mods[i].name) {
		  			case 'radius': this._radius = this._mods[i].value; break;
		  			case 'xOffset': this._xOffset = this._mods[i].value; break;
		  			case 'yOffset': this._yOffset = this._mods[i].value; break;
		  			case 'opacity': this._opacity = this._mods[i].value; break;
		  			default: break;
		  		}
		  	}
  		}
  	}

  	update() {
  		this._checkMods();
  	}

  	get x() { return this._x; }
  	get y() { return this._y; }

  	get radius() { return this._radius; }
  	set radius(value) { this._radius = value; }

  	get xOffset() { return this._xOffset; }
  	set xOffset(value) { this._xOffset = value; }

  	get yOffset() { return this._yOffset; }
  	set yOffset(value) { this._yOffset = value; }

  	get opacity() { return this._opacity; }
  	set opacity(value) { this._opacity = value; }

  	get mouseIn() { return this._mouseIn; }
  	set mouseIn(value) { this._mouseIn = (value ? true : false); }

  	get borderWidth() { return this._borderWidth; }
  	set borderWidth(value) { this._borderWidth = value; }

  	get showPrimaryColor() { return this._showPrimaryColor; }
  	set showPrimaryColor(value) { this._showPrimaryColor = (value ? true : false); }

  	get primaryColor() { return this._primaryColor; }
  	set primaryColor(value) { this._primaryColor = value; }

  	get fillColor() { return this._fillColor; }
  	set fillColor(value) { this._fillColor = value; }

  	get filled() { return this._filled; }
  	set filled(value) { this._filled = (value ? true : false); }

  	get isButton() { return this._isButton; }
  	set isButton(value) { this._isButton = (value ? true : false); }

  	get font() { return this._font; }
  	set font(value) { this._font = value; }

  	get text() { return this._text; }
  	set text(value) { this._text = value; }
}