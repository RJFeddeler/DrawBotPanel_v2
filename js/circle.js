class Circle {
	constructor(x, y, radius) {
		this._x 				= x;
	 	this._y 				= y;
	 	this._radius 			= radius;
	 	this._xOffset 			= 0;
	 	this._yOffset 			= 0;

	 	this._showPrimaryColor 	= false;
	 	this._primaryColor 		= '#000000';
	 	this._fillColor 		= '#000000';
	 	this._filled 			= false;
	 	this._opacity 			= 1.0;
	 	this._borderWidth 		= 1;

	 	this._mouseIn 			= false;
	 	this._mods 				= [];
	}

  	addMod(mod) {
  		this._mods.push(mod);
  		return this._mods.length - 1;
  	}

  	getModByName(name) {
  		for (var i = 0; i < this._mods.length; i++)
  			if (this._mods[i].name === name)
  				return this._mods[i];

  		return undefined;
  	}

  	update() {
  		var positionData 	= { position: { x: this._x, y: this._y }, mousePosition: { x: $mouseX, y: $mouseY }, mouseIn: this._mouseIn };

  		var results = [];
  		for (var i = 0; i < this._mods.length; i++)
  			results.push(this._mods[i].update(positionData));

  		var returnData = { deleteCircle: false, buttonShown: false };
  		for (var i = 0; i < results.length; i++) {
  			if (results[i].name 	 === 'radius')
  				this._radius = results[i].value;
  			else if (results[i].name === 'offsetX')
  				this._xOffset = results[i].value;
  			else if (results[i].name === 'offsetY')
  				this._yOffset = results[i].value;
  			else if (results[i].name === 'offset') {
  				this._xOffset = results[i].value.x;
  				this._yOffset = results[i].value.y; }
  			else if (results[i].name === 'opacity')
  				this._opacity = results[i].value;
  			else if (results[i].name === 'borderWidth')
  				this._borderWidth = results[i].value;
  			else if (results[i].name === 'primaryColor')
  				this._primaryColor = results[i].value;
  			else if (results[i].name === 'showPrimaryColor')
  				this._showPrimaryColor = results[i].value;
  			else if (results[i].name === 'fillColor')
  				this._fillColor = results[i].value;
  			else if (results[i].name === 'filled')
  				this._filled = results[i].value;

  			if (results[i].showPrimaryColor !== undefined)
  				this._showPrimaryColor = results[i].showPrimaryColor;
  			if (results[i].filled !== undefined)
  				this._filled = results[i].filled;
  			if (results[i].deleteMod === true)
  				this._mods.splice(i, 1);

  			if (results[i].deleteCircle)
  				returnData.deleteCircle = true;
  			if (results[i].buttonShown)
  				returnData.buttonShown = true;
  		}

  		return returnData;
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
}