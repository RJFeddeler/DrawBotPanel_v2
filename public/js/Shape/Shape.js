'use strict';

class Shape {
	constructor(prototype, id, x, y, radius, border, defaultColor) {
		this._prototype 	= prototype;

		this._id 			= id;
		this._x 			= x;
		this._y 			= y;

		this._radius 		= radius;
		this._offset 		= { x: 0, y: 0 };
		this._mouseIn 		= false;
		this._mouseNear 	= false;
		
		this._showPrimary 	= false;
		this._primaryColor 	= defaultColor 			|| '#000000';
		this._defaultColor 	= this._primaryColor;
		
		this._hidden 		= false;
		this._changed 		= true;
		this._opacity 		= 1.0;
		this._filled 		= false;
		this._border 		= border 				|| 1;
		
		this._mods 			= [];
	}

	update() {
		if (this._hidden)
			return {};

		var positionData = { position: { x: this._x, y: this._y }, mousePosition: { x: mouse.x(), y: mouse.y() }, mouseIn: this._mouseIn, mouseNear: this._mouseNear };
		var results = [];

		for (let i = 0; i < this._mods.length; i++)
			results.push(this._mods[i].update(positionData));

		var returnData = {};
		for (let i = 0; i < results.length; i++) {
			switch (results[i].name) {
				case 'radius':	this._radius	= results[i].value; break;
				case 'offset':	this._offset	= results[i].value; break;
				case 'opacity':	this._opacity	= results[i].value; break;
				case 'border':	this._border	= results[i].value; break;
				default: break;
			}

			// Shape Options
			if (results[i].showPrimary	!== undefined)	this._showPrimary	= results[i].showPrimary;
			if (results[i].filled		!== undefined)	this._filled		= results[i].filled;
			if (results[i].resetPrimary	!== undefined)	this._primaryColor	= this._defaultColor;
			if (results[i].deleteMod	!== undefined)	this._mods.splice(i, 1);

			// Passthrough Options
			if (results[i].deleteShape	!== undefined)	returnData.deleteShape	= true;
			if (results[i].buttonShown	!== undefined)	returnData.buttonShown	= results[i].buttonShown;
			if (results[i].panelShown	!== undefined)	returnData.panelShown	= results[i].panelShown;
		}

		return returnData;
	}

	draw(ctx) {
		this.drawGeneric(ctx, this._x + this._offset.x, this._y + this._offset.y, this._radius);
	}

	drawGeneric(ctx, x, y, radius) {
		this._prototype.draw(ctx, x, y, radius);
	}

	addMod(mod)			{ return (this._mods.push(mod) - 1);    }
	getModByName(name)	{ for (var i = 0; i < this._mods.length; i++) if (this._mods[i].name() === name) return this._mods[i];	}
	goalRadius()		{ var m = this.getModByName('radius'); return (m === undefined ? this._radius : m.goal());				}

	id()				{ return this._id;							}
	x()					{ return this._x;							}
	y()					{ return this._y;							}

	radius()			{ return this._radius;						}
	offset()			{ return this._offset;						}

	opacity()			{ return this._opacity;						}
	filled()			{ return this._filled;						}
	border()			{ return this._border;						}

	defaultColor()		{ return this._defaultColor;				}
	showPrimary()		{ return this._showPrimary;					}

	primaryColor()		{ return this._primaryColor;				}
	setPrimary(val)		{ this._primaryColor = val;					}

	hidden()			{ return this._hidden;						}
	setHidden(val)		{ this._hidden = (val ? true : false);		}

	mouseIn()			{ return this._mouseIn;						}
	setMouseIn(val)		{ this._mouseIn = (val ? true : false);		}

	mouseNear()			{ return this._mouseNear;					}
	setMouseNear(val)	{ this._mouseNear = (val ? true : false);	}
}