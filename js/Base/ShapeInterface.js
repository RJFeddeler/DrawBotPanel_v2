'use strict';

class ShapeInterface {
	constructor(canvasID, shapeSettings, theme, marginHeight, width, height) {
		this._theme 	= theme;

		this._ready 	= false;
		this._canvas 	= document.getElementById(canvasID);
		
		if (this._canvas)
			this._ctx = this._canvas.getContext('2d');

		if (this._ctx)
			this.init(shapeSettings, marginHeight, width, height);

		if (this._ready)
			this._menus = new MenuList(this.right(), this.bottom(), this.center());
	}

	init(shapeSettings, marginHeight, width, height) {
        if (!(this._ready = (this._canvas && this._ctx ? true : false)))
	    	return;

        this._canvasWidth 	= width;
        this._canvasHeight 	= height - (2 * marginHeight - 12);

        this._canvas.setAttribute('width', 	this._canvasWidth);
        this._canvas.setAttribute('height', this._canvasHeight);

        this._settings = shapeSettings;
        this._mouseOnAButton = false;

        this._buttons = [];
        this._panels  = [];

        this._createShapes(shapeSettings);

        this.update();
        this.render();
	}

	changeDimensions(width, height) {

	}

	_createShapes(settings) {
		if (!this._ready)
			return;

		var spacing = (2 * settings.radius) + settings.distance;

		this._columns = Math.floor(this._canvasWidth  / spacing) + (this._canvasWidth  % spacing === 0 ? 0 : 1);
		this._rows = 	Math.floor(this._canvasHeight / spacing) + (this._canvasHeight % spacing === 0 ? 0 : 1);

		var shapeCenter = {		x: Math.floor((this._columns * spacing) / 2),
								y: Math.floor((this._rows 	 * spacing) / 2) 		};

		var centerOffset = { 	x: Math.floor(spacing / 2) - (shapeCenter.x - Math.floor(this._canvasWidth / 2)),
								y: Math.floor(spacing / 2) - (shapeCenter.y - Math.floor(this._canvasHeight / 2))		};

		document.getElementById('headerLabel').style.padding = "0px " + Math.ceil(centerOffset.x / 2) + "px 0px 0px";

		this.shapes = [];
		for (let y = 0; y < this._rows; y++) {
			for (let x = 0; x < this._columns; x++) {
				if (settings.shape === 'Circle')
					var s = new Circle(this.shapes.length, x * spacing + centerOffset.x, y * spacing + centerOffset.y, settings.radius, settings.border, this._theme.panel);
				else
					continue;

				var modSettings = {
						goal: 			settings.radius,
						acceleration:	0.1,
						dampen: 		1.37,
						dampenZero: 	0.5,
						velocityZero: 	0.1,
						maxVelocity: 	20,
						maxValue: 		1000
				};

				s.addMod(
					new Mod('radius', 0, modSettings).addTrigger(
						new Trigger(10, ['mouseXY', '<', 50], 'resetOnMouseOut', 'atGoal').setConsequences(
							{ value: 0, velocity: 1.0, dampen: 1.37, dampenZero: 0.25 })));

				this.shapes.push(s);
			}
		}
	}

	createPanel(x, y, name, radius, defaultContent) {
		if (x < this._columns && y < this._rows)
			this._panels.push(new UIPanel(this._ctx, this.shapes[y * this._columns + x], name, radius, defaultContent));
	}

	deletePanel(id) {
		if (id >= this._panels.length)
			return;

		this._panels[id].delete();
		this._panels.splice(id, 1);
	}

	createButton(event, eventArg, x, y, name, label, icon, color) {
		if (x < this._columns && y < this._rows)
			this._buttons.push(new UIButton(event, eventArg, this.shapes[y * this._columns + x], name, label, icon, color));
	}

	deleteButton(id) {
		if (id >= this._buttons.length)
			return;

		this._buttons[id].delete();
		this._buttons.splice(id, 1);
	}

	handleButtonClick(event, arg) {
		switch (event) {
			case 'Menu':
				this.showMenu(arg, this.clearContents());
				break;
			case 'Content':
				this.showContent(arg);
				break;
		}
	}

	showBackButton() {
		if ($('#backButton').length > 0)
			$('#backButton').remove();

		var div = document.createElement("div");

		div.id 					= 'backButton';
		div.style.top 			= '0px';
		div.style.left 			= '0px';
		div.style.width 		= '20px';
		div.style.height 		= '20px';
		div.innerHTML 			= '<i class="fa fa-arrow-circle-o-left fa-fw"></i>';

		document.body.appendChild(div);
		div.addEventListener("mouseover", 	function() { this.displayHeaderLabel('Back to Main Menu'); }.bind(this));
		div.addEventListener("mouseout", 	function() { this.clearHeaderLabel(); }.bind(this));
		div.addEventListener("click", 		function() { this.handleButtonClick('Menu', 'M.Main'); }.bind(this));

		var animationName = 'bounceInRightHalf',
			animationEnd  = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $('#backButton').addClass(animationName).one(animationEnd, function() { $(this).removeClass(animationName); });
	}

	hideBackButton() {
		if ($('#backButton').length === 0)
			return;

		var animationName = 'bounceOutLeftHalf',
			animationEnd  = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $('#backButton').addClass(animationName).one(animationEnd, function() { $(this).remove(); });
	}

	hideShapesBehindPanel(id) {
		for (let i = 0; i < this.shapes.length; i++)
			if ((this.distanceBetween(i, this._panels[id].id()) < this._panels[id].radius()) && (i !== this._panels[id].id()))
				this.shapes[i].setHidden(true);
	}

	showHiddenShapes() {
		for (let i = 0; i < this.shapes.length; i++)
			this.shapes[i].setHidden(false);
	}

	clearContents() {
		const deleteDelay 	= 200;
		var currentDelay 	= 0;

		this.hideBackButton();
		this.clearHeaderLabel();
		this.showHiddenShapes();

		while (this._buttons.length > 0)
			this.deleteButton(0);
		while (this._panels.length > 0)
			this.deletePanel(0);

		return 1000; //currentDelay;
	}

	showMenu(menuName, delay = 0) {
		var menu 		= this._menus.get(menuName),
			menuDelay 	= (menu.speed < 1 ? 1 : (menu.speed > 5000 ? 1 : (5000 / menu.speed)));

        for (let i = 0; i < menu.items.length; i++) {
        	setTimeout(function(menuItem) {
                if (menuItem.type === 'Button')
                    this.createButton(menuItem.event, menuItem.eventArg, menuItem.x, menuItem.y, menuItem.name, menuItem.text, menuItem.icon, (menuItem.fancy ? this._theme.getAButtonColor() : null));
                else if (menuItem.type === 'Panel')
                	this.createPanel(menuItem.x, menuItem.y, menuItem.name, menuItem.radius, menuItem.defaultContent);
            }.bind(this), (i * menuDelay + delay), menu.items[i]);
        }

        for (let i = 0; i < menu.extras.length; i++) {
        	setTimeout(function(extraItem) {
        		if (extraItem === 'showBackButton')
        			this.showBackButton();
        	}.bind(this), ((i + menu.items.length) * menuDelay + delay), menu.extras[i]);
        }
	}

	_allMenuItemsShown() {
		let itemCount = 0;

		for (let i = 0; i < this._panels.length; i++)
			if (this._panels[i].ready())
				itemCount++;

		for (let i = 0; i < this._buttons.length; i++)
			if (this._buttons[i].ready())
				itemCount++;

		return ((itemCount >= this._menus.itemCount()) ? true : false);
	}

	showContent(contentName) {
		if (!contentName)
			return;

		for (let i = 0; i < this._panels.length; i++) {
			for (let j = 0; j < this._panels[i].content().length; j++) {
				if (this._panels[i].content()[j].name() === contentName) {
					let showing = this._panels[i].showing();
					if (showing && showing !== contentName)
						this._panels[i].hideContent(showing);

					if (showing !== contentName)
						this._panels[i].showContent(contentName);
				}
			}
		}
	}

	_setContentTriggers() {
		for (let i = 0; i < this._panels.length; i++) {
			for (let j = 0; j < this._panels[i].content().length; j++) {
				for (let k = 0; k < this._buttons.length; k++) {
					if (this._buttons[k].event() === 'Content' && this._buttons[k].eventArg() === this._panels[i].content()[j].name()) {
						this._panels[i].content()[j].updateTrigger(
							{
								x: 			this._buttons[k].shape().x(),
								y: 			this._buttons[k].shape().y(),
								radius: 	this._buttons[k].shape().goalRadius(),
								color: 		this._buttons[k].shape().primaryColor()
							}
						);
					}

				}
			}
		}
	}

	_showDefaultContents() {
		for (let i = 0; i < this._panels.length; i++)
			this.showContent(this._panels[i].defaultContent());
	}

	_buttonIdFromShapeId(id) 	{ for (let i = 0; i < this._buttons.length; i++) 	if (this._buttons[i].id() 	=== id) 	return i;	}
	_buttonIdFromName(name) 	{ for (let i = 0; i < this._buttons.length; i++) 	if (this._buttons[i].name() === name) 	return i; 	}
	_panelIdFromShapeId(id) 	{ for (let i = 0; i < this._panels.length; i++) 	if (this._panels[i].id() 	=== id) 	return i;	}
	_panelIdFromName(name) 		{ for (let i = 0; i < this._panels.length; i++) 	if (this._panels[i].name() 	=== name) 	return i; 	}

	displayHeaderLabel(text) {
		this._mouseOnAButton = true;

		$('#headerLabel').html(text).removeClass('headerTextHidden').addClass('headerTextShown');
	}

	clearHeaderLabel() {
		this._mouseOnAButton = false;

		var transitionEnd  = 'webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend';
		$('#headerLabel').removeClass('headerTextShown').addClass('headerTextHidden').one(transitionEnd, function() {
			if (!this._mouseOnAButton) $('#headerLabel').html('');
		}.bind(this));
	}

	distanceBetween(shape1, shape2) {
		var deltaX = this.shapes[shape1].x() - this.shapes[shape2].x(),
			deltaY = this.shapes[shape1].y() - this.shapes[shape2].y();

  		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  	}

	_drawShapes(layer) {
		var c;
		for (let i = 0; i < this.shapes.length; i++) {
			if (this.shapes[i].radius() <= 0 || this.shapes[i].hidden())
				continue;

			this._ctx.globalCompositeOperation = "source-over";

			if (layer === 0) {
				if (this.shapes[i].showPrimary()) { continue; }
				else
					c = this._theme.backgroundBase;
			}
			else if (layer === 1) {
				if (this.shapes[i].showPrimary()) { continue; }
				else
					c = '#000000';
			}
			else if (layer === 2) {
				if (!this.shapes[i].showPrimary()) { continue; }
				else
					c = this.shapes[i].primaryColor();
			}

			this._ctx.strokeStyle = c;
			this._ctx.fillStyle = c;
        	this._ctx.lineWidth = this.shapes[i].border();

        	var o = 1.0;
        	if (layer === 0)
        		o = 1.0 - this.shapes[i].opacity();
        	else if (layer === 2)
        		o = this.shapes[i].opacity();

        	if (o === 0.0)
        		continue;

        	if (o < 1.0 && layer > 0)
        		this._ctx.globalAlpha = o;

        	this._ctx.beginPath();
			this._ctx.arc(this.shapes[i].x() + this.shapes[i].offset().x, this.shapes[i].y() + this.shapes[i].offset().y, this.shapes[i].radius(), 0, 2 * Math.PI);
			
			this.shapes[i].setMouseIn((this._ctx.isPointInPath(mouse.x(), mouse.y())) ? true : false);
			
			if (layer === 2) {
				this._ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
				this._ctx.shadowBlur = 10;
				this._ctx.shadowOffsetX = 0;
				this._ctx.shadowOffsetY = 4;
			}

			this._ctx.stroke();

			if (this.shapes[i].filled())
				this._ctx.fill();

			this._ctx.shadowColor 	= '#000000';
			this._ctx.shadowBlur 	= 0;
			this._ctx.shadowOffsetX = 0;
			this._ctx.shadowOffsetY = 0;

			if (o < 1.0)
				this._ctx.globalAlpha = 1.0;
		}
	}

	_drawColorLayer() {
		var color = this._theme.backgroundPattern;

		if (!this._bgGradient) {
			var c = { 
				red: 	parseInt('0x' + color.substr(1, 2)),
				green: 	parseInt('0x' + color.substr(3, 2)),
				blue: 	parseInt('0x' + color.substr(5, 2))
			};

			this._bgGradient = this._ctx.createLinearGradient(0, 0, 0, this._canvasHeight);
			this._bgGradient.addColorStop(0, 	'rgba(' + c.red + ', ' + c.green + ', ' + c.blue + ', 0)');
			this._bgGradient.addColorStop(0.5, 	'rgba(' + c.red + ', ' + c.green + ', ' + c.blue + ', 1)');
			this._bgGradient.addColorStop(1, 	'rgba(' + c.red + ', ' + c.green + ', ' + c.blue + ', 0)');
		}

		this._ctx.globalCompositeOperation = "source-in";
		this._ctx.fillStyle = this._bgGradient;
		this._ctx.fillRect(0, 0, this._canvasWidth, this._canvasHeight);
		this._ctx.globalCompositeOperation = "source-over";
	}

	_drawBackground() {
		this._ctx.globalCompositeOperation = "destination-atop";
		this._ctx.fillStyle = this._theme.backgroundBase
		this._ctx.fillRect(0, 0, this._canvasWidth, this._canvasHeight);

		this._drawShapes(0);
	}

	_drawTopLayer() 	{ this._drawShapes(2); }
	_drawMaskLayer() 	{ this._drawShapes(1); }
	_clearCanvas() 		{ this._ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight); }
	
	update(lastTick) {
		if (!this._ready)
			return;

		var result,
			itemShown = false;

		for (let i = 0; i < this.shapes.length; i++) {
			result = this.shapes[i].update();

			if (result.deleteShape)
				this.shapes.splice(i--, 1);
			else if (result.buttonShown) {
				var id = this._buttonIdFromShapeId(i);
				if (typeof id === 'number') {
					this._buttons[id].shown(this.displayHeaderLabel.bind(this), this.clearHeaderLabel.bind(this), this.handleButtonClick.bind(this));
				}

				itemShown = true;
			}
			else if (result.panelShown) {
				var id = this._panelIdFromShapeId(i);
				if (typeof id === 'number') {
					this.hideShapesBehindPanel(id);
					this._panels[id].shown(PanelList.get(this._panels[id], window.getComputedStyle(this._canvas).top));
				}

				itemShown = true;
			}
		}

		if (itemShown && this._allMenuItemsShown()) {
			this._setContentTriggers();
			this._showDefaultContents();
		}

		for (let i = 0; i < this._panels.length; i++)
			this._panels[i].update();
	}

	render() {
		if (!this._ready)
			return;

		this._clearCanvas();
		this._drawMaskLayer();
		this._drawColorLayer();
		this._drawBackground();
		this._drawTopLayer();

		for (var i = 0; i < this._panels.length; i++)
			this._panels[i].render();
	}

	ctx() 			{ return this._ctx; 			}
	shape() 		{ return this._settings.shape; 	}
	shapeCount() 	{ return this.shapes.length; 	}
	bottom() 		{ return this._rows - 1; 		}
	right() 		{ return this._columns - 1; 	}
	rows() 			{ return this._rows; 			}
	columns() 		{ return this._columns; 		}
	center() { 
		return {
			floor: 		{ x: Math.floor(this._columns / 2), y: Math.floor(this._rows / 2 - 1) 	},
			ceiling: 	{ x: Math.ceil(this._columns / 2), 	y: Math.ceil(this._rows / 2 - 1) 	} 	}; 	}
}
