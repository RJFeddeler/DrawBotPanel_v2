'use strict';

class UICircles {
	constructor(canvasID, themeColor, marginHeight, circleSettings, width, height) {
		this._ready = false;
		this._themeColor = themeColor;
		this._canvas = document.getElementById(canvasID);
		
		if (this._canvas)
			this._ctx = this._canvas.getContext('2d');

		if (this._ctx)
			this.init(marginHeight, circleSettings, width, height);
	}

	init(marginHeight, circleSettings, width, height) {
        this._ready = (this._ctx ? true : false);
        if (!this._ready)
        	return;

        this._canvasWidth = width;
        this._canvasHeight = height - (2 * marginHeight - 12);

        this._canvas.setAttribute('width', this._canvasWidth);
        this._canvas.setAttribute('height', this._canvasHeight);

        this._originalSettings = circleSettings;
        this._backgroundColor = circleSettings.backgroundColor;
        this._mouseOnAButton = false;

        this._buttons = [];
        this._panels  = [];

        this._createCircles(circleSettings);
        this.update();
	}

	_createCircles(settings) {
		if (!this._ready)
			return;

		var spacing = (2 * settings.radius) + settings.distance;
		this._columns = Math.floor(this._canvasWidth  / spacing) + (this._canvasWidth  % spacing === 0 ? 0 : 1);
		this._rows = 	Math.floor(this._canvasHeight / spacing) + (this._canvasHeight % spacing === 0 ? 0 : 1);

		var circleCenter = {	x: Math.floor((this._columns * spacing) / 2),
								y: Math.floor((this._rows 	 * spacing) / 2) 		};

		var centerOffset = { 	x: Math.floor(spacing / 2) - (circleCenter.x - Math.floor(this._canvasWidth / 2)),
								y: Math.floor(spacing / 2) - (circleCenter.y - Math.floor(this._canvasHeight / 2))		};

		document.getElementById('headerLabel').style.padding = "0px " + Math.ceil(centerOffset.x / 2) + "px 0px 0px";

		this._circles = [];
		for (var y = 0; y < this._rows; y++) {
			for (var x = 0; x < this._columns; x++) {
				var c = new Circle(x * spacing + centerOffset.x, y * spacing + centerOffset.y, settings.radius);

				c.borderWidth 		= settings.borderWidth;
				c.primaryColor 		= settings.primaryColor;
				c.fillColor 		= settings.primaryColor;
				c.showPrimaryColor 	= false;

				var modStruct = {
						locked: 			true,
						goal: 				settings.radius,
						value: 				0,
						maxValue: 			1000,
						dampen: 			1.37,
						dampenZero: 		0.5,
						acceleration:		0.1,
						velocity: 			0.5,
						velocityZero: 		0.1,
						maxVelocity: 		50
				};

				var m = new Mod('radius', modStruct);
				var t = new Trigger(100, ['mouseXY', '<', 50 ], 'resetAtGoal', 'atGoal', true );
				t.setPrimaryConsequences({ value: 1, velocity: 1 });
				t.setSecondaryConsequences({ dampen: 1.27, dampenZero: 0.25 });
				m.addTrigger(t);
				c.addMod(m);

				this._circles.push(c);
			}
		}
	}

	showBackButton() {
		if ($('#backButton').length > 0)
			$('#backButton').remove();

		var div = document.createElement("div");

		div.id = 'backButton';
		div.style.top 			= '0px';
		div.style.left 			= '0px';
		div.style.width 		= '20px';
		div.style.height 		= '20px';
		div.innerHTML 			= '<i class="fa fa-arrow-circle-o-left fa-fw"></i>';

		document.body.appendChild(div);
		div.addEventListener("mouseover", 	function() { ui.displayHeaderLabel('Back to Main Menu'); });
		div.addEventListener("mouseout", 	function() { ui.clearHeaderLabel(); });
		div.addEventListener("click", 		function() { ui.buttonClick('back'); });

		var animationName = 'bounceInRightHalf'; //'fadeInUpHalf';
		var animationEnd  = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $('#backButton').addClass(animationName).one(animationEnd, function() {
            $(this).removeClass(animationName);
        });
	}

	hideBackButton() {
		if ($('#backButton').length === 0)
			return;

		var animationName = 'animated bounceOutLeft';
		var animationEnd  = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $('#backButton').addClass(animationName).one(animationEnd, function() {
            $(this).removeClass(animationName);
            $(this).remove();
        });
	}

	buttonClick(name) {
		var delay;
		//this._createClickEffect(button);

		switch (name) {
			case 'back':
				delay = this.clearContents();
				this.showMenu(menuSystem.menu('main'), delay);
				break;
			case 'main_overview':
				delay = this.clearContents();
				this.showMenu(menuSystem.menu('overview'), delay);
				break;
			case 'main_uploadROB':
				delay = this.clearContents();
				this.showMenu(menuSystem.menu('uploadROB'), delay);
				break;
			case 'main_uploadIMG':
				delay = this.clearContents();
				this.showMenu(menuSystem.menu('uploadIMG'), delay);
				break;
			case 'main_fileManager':
				delay = this.clearContents();
				this.showMenu(menuSystem.menu('fileManager'), delay);
				break;
			case 'main_freeDraw':
				delay = this.clearContents();
				this.showMenu(menuSystem.menu('freeDraw'), delay);
				break;
			case 'main_settings':
				delay = this.clearContents();
				this.showMenu(menuSystem.menu('settings'), delay);
				break;
			default: break;
		}
	}

	clearContents() {
		const deleteDelay = 200;
		var currentDelay = 0;

		this.hideBackButton();
		this.clearHeaderLabel();

		while (this._buttons.length > 0) {
			this.deleteButton(this._buttons[0].id);
		}
		while (this._panels.length > 0) {
			this.deletePanel(this._panels[0].id);
		}

		return 1000; //currentDelay;
	}

	showMenu(menu, delay = 0) {
        const menuDelay = 200;
        var menuStart = delay;

        for (var i = 0; i < menu.items.length; i++) {
            setTimeout(function(menuItem) {
                if (menuItem.type === 'Button')
                    ui.createButton(menuItem.x, menuItem.y, menuItem.name, menuItem.caption, menuItem.icon);
                else if (menuItem.type === 'Panel')
                    ui.createPanel(menuItem.x, menuItem.y, menuItem.size, menuItem.name, menuItem.title);
            }, (menuStart += menuDelay), menu.items[i]);
        }

        for (var i = 0; i < menu.extras.length; i++) {
        	setTimeout(function(extraItem) {
        		if (extraItem === 'showBackButton')
        			this.showBackButton();
        	}.bind(this), (menuStart += menuDelay), menu.extras[i]);
        }
	}

	_buttonIdFromCircleId(id) {
		for (var i = 0; i < this._buttons.length; i++)
			if (this._buttons[i].id === id)
				return i;

		return -1;
	}

	createButton(x, y, name, label, icon) {
		if (x >= this._columns || y >= this._rows)
			return;

		var id = y * this._columns + x;
		var btn = new UIButton(this._ctx, id, name, label, icon);
		//this._circles[id].button = btn;
		this._buttons.push(btn);
	}

	deleteButton(id) {
		for (var i = 0; i < this._buttons.length; i++) {
			if (this._buttons[i].id === id) {
				this._buttons[i].deleteMe();
				this._buttons.splice(i, 1);

				return;
			}
		}
	}

	createPanel(x, y, radius, name, title) {
		var panel = new UIPanel(this._ctx, x, y, radius, name, title);
		this._panels.push(panel);

		return panel.id;
	}

	deletePanel(id) {
		for (var i = 0; i < this._panels.length; i++) {
			if (this._panels[i].id === id) {
				this._panels[i].deleteMe();
				this._panels.splice(i, 1);

				return;
			}
		}
	}

	displayHeaderLabel(caption) {
		this._mouseOnAButton = true;

		document.getElementById('headerLabel').innerHTML = caption;

		$('#headerLabel').removeClass('fadeCaptionHidden');
		$('#headerLabel').addClass('fadeCaptionShown');
	}

	clearHeaderLabel() {
		var transitionName = 'fadeCaptionHidden';
		var transitionEnd  = 'webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend';

		this._mouseOnAButton = false;

		$('#headerLabel').removeClass('fadeCaptionShown');
		$('#headerLabel').addClass(transitionName).one(transitionEnd, function() {
			if (this._mouseOnAButton === false)
            	document.getElementById('headerLabel').innerHTML = '';
        });
	}

	_drawCircles(layer) {
		if (!this._ready)
			return;

		var c;
		for (var i = 0; i < this._circles.length; i++) {
			if (this._circles[i].radius <= 0)
				continue;

			this._ctx.globalCompositeOperation = "source-over";

			if (layer === 0) { 		// Background
				if (this._circles[i].showPrimaryColor) { continue; }
				c = this._backgroundColor;
			}
			else if (layer === 1) { // Mask
				if (this._circles[i].showPrimaryColor) { continue; }
				else {
					c = '#000000';
				}
			}
			else if (layer === 2) { // Primary
				if (!this._circles[i].showPrimaryColor) { continue; }
				else {
					c = this._circles[i].primaryColor;
				}
			}

			this._ctx.strokeStyle = c;
        	this._ctx.lineWidth = this._circles[i].borderWidth;

        	var o = 1.0;
        	if (layer === 0 && !this._circles[i].showPrimaryColor)
        		o = 1.0 - this._circles[i].opacity;
        	else if (layer === 2)
        		o = this._circles[i].opacity;

        	if (o === 0.0)
        		continue;

        	if (o < 1.0 && layer > 0)
        		this._ctx.globalAlpha = o;

        	this._ctx.beginPath();
			this._ctx.arc(this._circles[i].x + this._circles[i].xOffset, this._circles[i].y + this._circles[i].yOffset, this._circles[i].radius, 0, 2 * Math.PI);
			
			this._circles[i].mouseIn = (this._ctx.isPointInPath($mouseX, $mouseY)) ? true : false;
			
			if (layer === 2) {
				this._ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
				this._ctx.shadowBlur = 10;
				this._ctx.shadowOffsetX = 0;
				this._ctx.shadowOffsetY = 4;
			}

			this._ctx.stroke();

			if (this._circles[i].filled) {
				this._ctx.fillStyle = c;
				this._ctx.fill();
			}

			this._ctx.shadowColor = "black";
			this._ctx.shadowBlur = 0;
			this._ctx.shadowOffsetX = 0;
			this._ctx.shadowOffsetY = 0;

			if (o < 1.0)
				this._ctx.globalAlpha = 1.0;
		}
	}

	_drawColorLayer(color, direction = 'vertical') {
		if (!this._bgGradient || !this._bgGradientColor || (this._bgGradientColor !== color) || (this._bgGradientDirection !== direction)) {
			this._bgGradientColor = color;
			this._bgGradientDirection = direction;

			if (this._bgGradientColor === 'rainbow') {
				if (this._bgGradientDirection === 'vertical')
					this._bgGradient = this._ctx.createLinearGradient(0, 0, 0, this._canvasHeight);
				else
					this._bgGradient = this._ctx.createLinearGradient(0, 0, this._canvasWidth, 0);

				this._bgGradient.addColorStop(0, 	'#ff0000');		// RED
				this._bgGradient.addColorStop(0.25, '#ff7f00');		// ORANGE
				this._bgGradient.addColorStop(0.5, 	'#ffff00');		// YELLOW
				this._bgGradient.addColorStop(0.75, '#00ff00');		// GREEN
				this._bgGradient.addColorStop(1, 	'#0000ff');		// BLUE
			}
			else {
				var c;
				if (this._bgGradientColor.substr(0, 1) === '#' && (this._bgGradientColor.length === 4 || this._bgGradientColor === 7)) {
					if (this._bgGradientColor.length === 4) {
						var temp = this._bgGradientColor;
						this._bgGradientColor = '#' + temp.substr(1,1) + temp.substr(1,1) + temp.substr(2,1) + temp.substr(2,1) + temp.substr(3,1) + temp.substr(3,1);
					}

					c = { 	red: 	parseInt('0x' + this._bgGradientColor.substr(1, 2)),
							green: 	parseInt('0x' + this._bgGradientColor.substr(3, 2)),
							blue: 	parseInt('0x' + this._bgGradientColor.substr(5, 2))		};
				}

				else if (this._bgGradientColor === 'blue')
					c = { red: 2, green: 136, blue: 209 };
				else if (this._bgGradientColor === 'orange')
					c = { red: 255, green: 112, blue: 67 };
				else if (this._bgGradientColor === 'red')
					c = { red: 255, green: 20, blue: 20 };
				else
					c = { red: 220, green: 220, blue: 220 };

				if (this._bgGradientDirection === 'vertical')
					this._bgGradient = this._ctx.createLinearGradient(0, 0, 0, this._canvasHeight);
				else
					this._bgGradient = this._ctx.createLinearGradient(0, 0, this._canvasWidth, 0);

				this._bgGradient.addColorStop(0, 	'rgba(' + c.red + ', ' + c.green + ', ' + c.blue + ', 0)');
				this._bgGradient.addColorStop(0.5, 	'rgba(' + c.red + ', ' + c.green + ', ' + c.blue + ', 1)');
				this._bgGradient.addColorStop(1, 	'rgba(' + c.red + ', ' + c.green + ', ' + c.blue + ', 0)');
			}
		}

		this._ctx.globalCompositeOperation = "source-in";
		this._ctx.fillStyle = this._bgGradient;
		this._ctx.fillRect(0, 0, this._canvasWidth, this._canvasHeight);
		this._ctx.globalCompositeOperation = "source-over";
	}

	_drawBackground() {
		this._ctx.globalCompositeOperation = "destination-atop";
		this._ctx.fillStyle = this._backgroundColor;
		this._ctx.fillRect(0, 0, this._canvasWidth, this._canvasHeight);

		this._drawCircles(0);
	}

	_drawTopLayer() { this._drawCircles(2); }
	_drawMaskLayer() { this._drawCircles(1); }
	_clearCanvas() { this._ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight); }
	_drawCanvas() {
		this._clearCanvas();
		this._drawMaskLayer();
		this._drawColorLayer(this._themeColor);
		this._drawBackground();
		this._drawTopLayer();
	}

	update() {
		if (!this._ready)
			return;

		var result;
		for (var i = 0; i < this._circles.length; i++) {
			result = this._circles[i].update();

			if (result.deleteCircle)
				this._circles.splice(i--, 1);
			else if (result.buttonShown) {
				var id = this._buttonIdFromCircleId(i);
				if (id >= 0)
					this._buttons[id].showIcon();
			}
		}

		this._drawCanvas();
	}

	get center() 	{ return { floor: { x: Math.floor(this._columns / 2), y: Math.floor(this._rows / 2 - 1) }, ceiling: { x: Math.ceil(this._columns / 2), y: Math.ceil(this._rows / 2 - 1) } }; }
	get bottom() 	{ return this._rows - 1; }
	get right() 	{ return this._columns - 1; }
	get rows() 		{ return this._rows; }
	get columns() 	{ return this._columns; }
}
