'use strict';

class ShapeInterface {
	constructor(shapeSettings, theme, marginHeight, width, height) {
		this._theme 	= theme;

		this._ready 	= false;
		this._canvas 	= document.querySelector('#UIMainCanvas');

		this._buttons 	= [];
		this._panels 	= [];
		
		if (this._canvas)
			this._ctx = this._canvas.getContext( '2d' );

		if (this._ctx)
			this.init( shapeSettings, marginHeight, width, height );

		if (this._ready)
			this._menus = new MenuList( this.right(), this.bottom(), this.center() );
	}

	init(shapeSettings, marginHeight, width, height) {
		if (!(this._ready = (this._canvas && this._ctx ? true : false)))
			return;

		this._canvasWidth  = width;
		this._canvasHeight = height - (2 * marginHeight - 12);

		this._canvas.setAttribute( 'width', this._canvasWidth );
		this._canvas.setAttribute( 'height', this._canvasHeight );

		this._settings = shapeSettings;
		this._mouseOnAButton = false;

		this._bland  = false;
		this._freeze = false;

		this._createShapes( shapeSettings );
		this._createUIElements();

		this.clearLinkRequests();
		this.initDataStorage();
		this.initProcessingWorker();

		//////////this._socket = io.connect();

		this.update();
		this.render();
	}

	rpiSendCMD(cmd) {
		socket.emit('command', cmd);
	}

	changeDimensions(width, height) {

	}

	makeBland() {
		this._bland = true;
	}

	freeze() {
		this._freeze = true;
	}

	unfreeze() {
		this._freeze = false;
	}



	_createUIElements() {
		this.UIHeaderCaption = new UIElement( 'div'
			).appendTo( document.querySelector('#UIHeader').querySelectorAll('div')[1]
			).id('UIHeaderCaption'
			).addClass('headerCaptionHidden'
		);

		this.UIBackButton = new UIElement('div', 'UIBackButton'
			).html('<i class="fas fa-angle-double-left"></i>'
			).addListener('mouseover', function() { this.displayHeaderLabel('Back to Main Menu'); }.bind(this)
			).addListener('mouseout', function() { this.clearHeaderLabel(); }.bind(this)
			).addListener('click', function() { this.handleButtonClick('Menu', 'M.Main'); }.bind(this)
			).appendTo( document.querySelector('#UIHeader').querySelectorAll('div')[0]
			).createAnimation(
				{ name: 'fadeLeft' },
				{ name: 'runningFadeLeft-out' },
				false,
				false
		);

		this.UIStopButton = new UIElement('div', 'UIStopButton'
			).html('<i class="fas fa-times-circle"></i>'
			).addListener('mouseover', function() { this.displayHeaderLabel('Cancel Drawing'); }.bind(this)
			).addListener('mouseout', function() { this.clearHeaderLabel(); }.bind(this)
			).addListener('click', function() { this.handleButtonClick('STOP'); }.bind(this)
			).appendTo( document.querySelector('#UIHeaderR')
			).createAnimation(
				{ name: 'fadeRight' },
				{ name: 'runningFadeRight-out' },
				false,
				false
		);
	}

	_createShapes(settings) {
		var spacing = (2 * settings.radius) + settings.distance;

		this._columns 	= Math.floor(this._canvasWidth  / spacing) + (this._canvasWidth  % spacing < 0 ? 0 : 1);
		this._rows 		= Math.floor(this._canvasHeight / spacing) + (this._canvasHeight % spacing === 0 ? 0 : 1);

		var shapeCenter = {
			x: Math.floor((this._columns * spacing) / 2),
			y: Math.floor((this._rows 	 * spacing) / 2)
		};

		var centerOffset = {
			x: Math.floor(spacing / 2) - (shapeCenter.x - Math.floor(this._canvasWidth / 2)),
			y: Math.floor(spacing / 2) - (shapeCenter.y - Math.floor(this._canvasHeight / 2))
		};

		this.shapes = [];
		for (let y = 0; y < this._rows; y++) {
			for (let x = 0; x < this._columns; x++) {
				var s = new Shape(
					ShapePrototype(settings.shape),
					this.shapes.length,
					x * spacing + centerOffset.x,
					y * spacing + centerOffset.y,
					settings.radius,
					settings.border,
					this._theme.panel
				);

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
						new Trigger(10, ['mouseXY', 'isNear'], 'resetOnMouseOut', 'atGoal' //'<', 50
							).setConsequences( { value: 0, velocity: 1.0, dampen: 1.37, dampenZero: 0.25 } )
						)
					);

				this.shapes.push(s);
			}
		}
	}

	initDataStorage() {
		this._dataStorage = {
			img: {
				original: null,
				processed: null
			},
			svg: {

			},
			rob: {

			}
		};
	}

	spawnTextDialog(header, inputLabel, defaultValue) {
		return new Promise((resolve, reject) => {
			var dialogOverlay = document.createElement('div');
			dialogOverlay.className = 'DialogOverlay';

			var dialogBox = document.createElement('form');
			dialogBox.className = 'DialogBox';
			dialogBox.innerHTML = '<div id="dialogBubble"><p>' + header + '</p><div class="input-field"><input id="textDialogValue" type="text"' + (defaultValue ? ' value="' + defaultValue + '"' : '') + '><label' + (defaultValue ? ' class="active"' : '') + ' for="textDialogValue">' + inputLabel + '</label></div><div id="dialogButtons"><i id="dialogCancel" class="fas fa-times-circle"></i><i id="dialogOk" class="fas fa-check-circle"></i></div></div>';

			dialogOverlay.appendChild(dialogBox);

			document.body.appendChild(dialogOverlay);

			dialogOverlay.addEventListener('click', function(e) {
				this.closeDialog(dialogOverlay, dialogBox);
				reject('TextDialog Canceled');
			}.bind(this));
			
			dialogBox.addEventListener('click', function(e) {
				e.stopPropagation();
				if (e.target.id === 'dialogCancel') {
					this.closeDialog(dialogOverlay, dialogBox);
					reject('TextDialog Canceled');
				}
				else if (e.target.id === 'dialogOk') {
					var response = document.querySelectorAll('#textDialogValue');

					if (!response)
						reject('Failed to get textDialog input value.');
					else if (!response[0].value || response[0].value === '')
						reject('Invalid Response!');
					else
						resolve(response[0].value);
				}
			}.bind(this));
			
			setTimeout( function() { dialogBox.classList.add('showing'); }, 100);
		});
	}

	spawnYesNoDialog(header, question) {
		return new Promise((resolve, reject) => {
			var dialogOverlay = document.createElement('div');
			dialogOverlay.className = 'DialogOverlay';

			var dialogBox = document.createElement('form');
			dialogBox.className = 'DialogBox';
			dialogBox.innerHTML = '<div id="dialogBubble"><p>' + header + '</p><p id="dialogYesNoQuestion">' + question + '</p><div id="dialogButtons"><i id="dialogCancel" class="fas fa-times-circle"></i><i id="dialogOk" class="fas fa-check-circle"></i></div></div>';

			dialogOverlay.appendChild(dialogBox);

			document.body.appendChild(dialogOverlay);

			dialogOverlay.addEventListener('click', function(e) {
				this.closeDialog(dialogOverlay, dialogBox);
				reject('YesNoDialog Canceled');
			}.bind(this) );
			
			dialogBox.addEventListener('click', function(e) {
				e.stopPropagation();
				if (e.target.id === 'dialogCancel') {
					this.closeDialog(dialogOverlay, dialogBox);
					reject('YesNoDialog Canceled');
				}
				else if (e.target.id === 'dialogOk')
					resolve();
			}.bind(this));
			
			setTimeout( function() { dialogBox.classList.add('showing'); }, 100);
		});
	}

	spawnInfoDialog(header, data) {
		var dialogOverlay = document.createElement('div');
		dialogOverlay.className = 'DialogOverlay';

		var dialogData = '';

		var dialogBox = document.createElement('form');
		dialogBox.className = 'DialogBox';
		dialogBox.innerHTML = '<div id="dialogBubble"><p>' + header + '</p><div id="dialogInfo">' + dialogData + '</div><div id="dialogButtons"><i id="dialogCancel" class="fas fa-times-circle"></i></div></div>';

		dialogOverlay.appendChild(dialogBox);

		document.body.appendChild(dialogOverlay);

		dialogOverlay.addEventListener('click', function(e) { this.closeDialog(dialogOverlay, dialogBox); }.bind(this) );
		dialogBox.addEventListener('click', function(e) { e.stopPropagation(); if (e.target.id == 'dialogCancel') this.closeDialog(dialogOverlay, dialogBox); }.bind(this) );
		
		setTimeout( function() { dialogBox.classList.add('showing'); }, 100);
	}

	closeDialog(dialogOverlay, dialogBox) {
		dialogBox.classList.remove('showing');
		setTimeout( function() { document.body.removeChild(dialogOverlay); }, 800);
	}

	showStopButton() {
		this.UIStopButton.playShowAnimation();
	}

	initProcessingWorker() {
		this._worker = new Worker('public/js/Processing/worker.js');
		this._worker.addEventListener('message', function(e) {
			this._dataStorage.img.processed = e.data;
			let el = this.searchContent('M.LoadIMG_P.Preview_C.Preview').searchElement(UICanvas);
			if (el)
				IMG.hermiteDownsample(el.canvas(), this._dataStorage.img.processed, el.canvas().width, el.canvas().height);
		}.bind(this));
	}

	startProcessingWorker(settings) {
		if (!settings)
			return;

		if (!this._dataStorage.img.original)
			return;

		this._dataStorage.img.processed = null;

		this._worker.postMessage({ 'cmd': 'processImg', 'image': this._dataStorage.img.original, 'settings': settings })
	}

	handleButtonClick(event, arg) {
		switch (event) {
			case 'Command':
				this.handleCommand(arg);
				break;
			case 'Menu':
				this.showMenu(arg, this.clearContents());
				break;
			case 'Content':
				this.showContent(arg);
				break;
			case 'Dropdown':
				break;
			case 'File':
				break;
			case 'STOP':
				if (socket)
					socket.emit('STOP', {});
				break;
		}
	}

	handleCommand(cmd) {
		switch (cmd) {
			case 'BLAHZZZNOW':
				var zVal = Number(document.getElementById('idTESTINGzValue').value);
				this.rpiSendCMD({ z: zVal });
				break;
			case 'M.LoadSVG_P.Preview_CMD.LoadFile':
				this.openFileInput('svg', function(file) {
					SVG.loadFromLocal(file).then(svg => {
						var result = SVG.convertToROB(SVG.parseNode(svg.image));

						if (!result)
							return;

						var minX, maxX, minY, maxY;
						var offsetX = 0.0, offsetY = 0.0;

						for (let i = 0; i < result.length; i++) {
							if (result[i].hasOwnProperty('x') && result[i].hasOwnProperty('y')) {
								if (minX === undefined || maxX === undefined || minY === undefined || maxY === undefined) {
									minX = result[i].x;
									maxX = result[i].x;
									minY = result[i].y;
									maxY = result[i].y;
								}
								else {
									if (result[i].x < minX)
										minX = result[i].x;
									else if (result[i].x > maxX)
										maxX = result[i].x;

									if (result[i].y < minY)
										minY = result[i].y;
									else if (result[i].y > maxY)
										maxY = result[i].y;
								}
							}
						}

						offsetX = 0.0; //minX * -1.0;
						offsetY = 0.0; //minY * -1.0;

						var txt = '';

						for (let i = 0; i < result.length; i++) {
							if (result[i].hasOwnProperty('z'))
								txt += 'Z0 ' + result[i].z + '\n';
							else if (result[i].hasOwnProperty('x') && result[i].hasOwnProperty('y'))
								txt += 'M0 ' + (result[i].x + offsetX).toFixed(2) + ',' + (result[i].y + offsetY).toFixed(2) + '\n';
						}

						/*
						this.spawnTextDialog('Save ROB As', svg.name, svg.name.split('.')[0]).then(response => {
							if (response.toLowerCase().endsWith('.rob'))
								response = response.slice(0, -4);

							if (socket && response.match(/^[a-zA-Z_-]+$/))
								socket.emit('newROB', { filename: response, data: txt });

						});
						*/

						var a = document.createElement("a");
					    var file = new Blob([txt], { type: 'text/plain' });
					    a.href = URL.createObjectURL(file);
					    a.download = 'newArt.rob';
					    a.click();
					}).catch(error => {
						console.log(error);
					});
				}.bind(this));

				break;
			case 'M.LoadIMG_P.Preview_CMD.LoadFile':
				let elPreviewCanvas = this.searchContent('M.LoadIMG_P.Preview_C.Preview').searchElement(UICanvas);
				if (elPreviewCanvas) {
					this.openFileInput('img', function(file) {
						elPreviewCanvas.resetCanvas();
						IMG.loadAndCopyResized(file, elPreviewCanvas.canvas()).then(original => {
							this._dataStorage.img.original = original;
						}).catch(error => {
							console.log('ERROR: ' + error);
						});
					}.bind(this));
				}
				else
					console.log("Preview Canvas Not Found!");

				break;
			case 'M.LoadIMG_P.Preview_C.Preview_CMD.StartProcessing':
				let elBlur 		= this.searchContent('M.LoadIMG_P.Gaussian_C.Gaussian');
				let elCanny 	= this.searchContent('M.LoadIMG_P.Canny_C.Canny');
				let elFilters 	= this.searchContent('M.LoadIMG_P.Filters_C.Filters');

				if (!elBlur || !elCanny || !elFilters)
					return;

				this.startProcessingWorker(
					{
						blurKernel: parseInt(elBlur.searchElement(UISlidePicker, 1).value()),
						blurSigma: parseFloat(elBlur.searchElement(UISlidePicker, 2).value()),
						cannyAlgo: "Sobel",
						cannyHystLow: parseInt(elCanny.searchElement(UISlidePicker, 1).value()[0]),
						cannyHystHigh: parseInt(elCanny.searchElement(UISlidePicker, 1).value()[1]),
						invert: true
					});

				break;
		}
	}

	openFileInput(type, callback) {
		var i = document.createElement('input');

		i.className = 'hiddenFileInput';
		i.type 		= 'file';

		if (type === 'img')
			i.accept = "image/png,image/jpg,image/bmp";
		else if (type === 'svg')
			i.accept = 'image/svg+xml';
		else if (type === 'rob')
			i.accept = '.rob';
		else
			return null;

		i.addEventListener("change", function() {
			callback(this.files[0]);
		});

		document.body.appendChild(i);
		i.click();
	}

	hideShapesCoveredByShape(shapeID) {
		var exceptions = [];
		for (let i = 0; i < this._buttons.length; i++)
			exceptions.push(this._buttons[i].shape().id());
		for (let i = 0; i < this._panels.length; i++)
			exceptions.push(this._panels[i].shape().id());

		exceptions.sort(function(a, b){return a - b});

		var currIndex = 0;
		var currValue = exceptions[currIndex];

		for (let i = 0; i < this.shapes.length; i++) {
			if (i == currValue) {
				currValue = exceptions[++currIndex];
				continue;
			}

			var deltaX = this.shapes[i].x() - this.shapes[shapeID].x(),
				deltaY = this.shapes[i].y() - this.shapes[shapeID].y(),
				distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

			if ((distance < this.shapes[shapeID].radius()) && (i !== shapeID))
				this.shapes[i].setHidden(true);
		}
	}

	hideInactiveShapes() {
		var exceptions = [];
		for (let i = 0; i < this._buttons.length; i++)
			exceptions.push(this._buttons[i].shape().id());
		for (let i = 0; i < this._panels.length; i++)
			exceptions.push(this._panels[i].shape().id());

		exceptions.sort(function(a, b){return a - b});

		var currIndex = 0;
		var currValue = exceptions[currIndex];

		for (let i = 0; i < this.shapes.length; i++) {
			if (i == currValue) {
				currValue = exceptions[++currIndex];
				this.shapes[i].setHidden(false);
			}
			else
				this.shapes[i].setHidden(true);
		}
	}

	showHiddenShapes() {
		for (let i = 0; i < this.shapes.length; i++)
			this.shapes[i].setHidden(false);
	}

	clearContents() {
		const removeDelay 	= 200;
		var currentDelay 	= 0;

		this.clearLinkRequests();
		this.clearHeaderLabel();
		this.showHiddenShapes();
		this.UIBackButton.playHideAnimation();
		this.UIStopButton.playHideAnimation();

		while (this._buttons.length > 0) {
			this._buttons[0].remove();
			this._buttons.splice(0, 1);
		}
		while (this._panels.length > 0) {
			this._panels[0].remove();
			this._panels.splice(0, 1);
		}

		return 1000; //currentDelay;
	}

	showMenu(menuName, delay = 0) {
		var menu 		 = this._menus.get(menuName),
			menuDelay 	 = (menu.speed < 1 ? 1 : (menu.speed > 5000 ? 1 : (5000 / menu.speed)));

		for (let i = 0; i < menu.items.length; i++) {
			setTimeout(function(menuItem) {
				if (menuItem.type === 'Button') {
					this._buttons.push(
						new UIButton(
							menuItem.event,
							menuItem.eventArg,
							this.shapes[menuItem.y * this._columns + menuItem.x],
							menuItem.label,
							menuItem.icon,
							this.handleButtonClick.bind(this),
							this.displayHeaderLabel.bind(this),
							this.clearHeaderLabel.bind(this)
						)
					);
				}
				else if (menuItem.type === 'Panel') {
					var p = new UIPanel(
						menuItem.name,
						this.shapes[menuItem.y * this._columns + menuItem.x],
						menuItem.radius,
						parseInt( this._canvas.getBoundingClientRect().top ),
						parseInt( window.getComputedStyle( this._canvas ).width ),
						parseInt( window.getComputedStyle( this._canvas ).height )
					);

					var c = PanelList.get(menuItem.name, p);
					if (c) {
						p.addContent(c);
						var r = p.getLinkRequests();
						if (r.length > 0)
							this.addLinkRequest(r);
					}

					this._panels.push(p);
				}
			}.bind(this), (i * menuDelay + delay), menu.items[i]);
		}

		if (menu.showBackButton)
			setTimeout( function() { this.UIBackButton.playShowAnimation(); }.bind(this), (menu.items.length * menuDelay + delay) );
	}

	clearLinkRequests() {
		this._linkRequests = [];
	}

	addLinkRequest(req) {
		for (let i = 0; i < req.length; i++)
			this._linkRequests.push(req[i]);
	}

	checkLinkRequests() {
		for (let i = 0; i < this._linkRequests.length; i++) {
			let c = this.searchContent(this._linkRequests[i].dest)

			if (!c) {
				if (this._linkRequests[i].dest === 'S.System_CMD.GetSharedSystemFunctions')
					c = this.getSharedSystemFunctions.bind(this);
			}

			if (c) {
				this._linkRequests[i].source.transferLink(this._linkRequests[i].dest, c);
				this._linkRequests.splice(i, 1);
				this.checkLinkRequests();
			}
		}
	}

	getSharedSystemFunctions() {
		return {
			freeze:   this.freeze.bind(this),
			unfreeze: this.unfreeze.bind(this),

			spawnTextDialog: this.spawnTextDialog.bind(this),
			spawnYesNoDialog: this.spawnYesNoDialog.bind(this),
			spawnInfoDialog: this.spawnInfoDialog.bind(this),
			
			mouseOver:  this.displayHeaderLabel.bind(this),
			mouseOut:   this.clearHeaderLabel.bind(this),
			mouseClick: this.handleButtonClick.bind(this),

			showStopButton: this.showStopButton.bind(this)
		};
	}

	searchContent(contentName) {
		for (let i = 0; i < this._panels.length; i++)
			for (let j = 0; j < this._panels[i].content().length; j++)
				if (this._panels[i].content()[j].name() === contentName)
					return this._panels[i].content()[j];

		return null;
	}

	showContent(contentName) {
		for (let i = 0; i < this._panels.length; i++) {
			for (let j = 0; j < this._panels[i].content().length; j++) {
				if (this._panels[i].content()[j].name() === contentName) {
					let active = this._panels[i].active();
					if (active !== contentName) {
						if (active)
							var delay = this._panels[i].hideContent(active) || 0;
						if (delay)
							setTimeout(function() { this._panels[i].showContent(contentName); }.bind(this), delay);
						else
							this._panels[i].showContent(contentName);
					}

					return;
				}
			}
		}
	}

	displayHeaderLabel(text) {
		this._mouseOnAButton = true;

		//this.UIHeaderCaption.html(text);
		$('#UIHeaderCaption').html(text).removeClass('headerCaptionHidden').addClass('headerCaptionShown');
	}

	clearHeaderLabel() {
		this._mouseOnAButton = false;

		var transitionEnd  = 'webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend';
		$('#UIHeaderCaption').removeClass('headerCaptionShown').addClass('headerCaptionHidden').one(transitionEnd, function() {
			if (!this._mouseOnAButton) $('#UIHeaderCaption').html('');
		}.bind(this));
	}

	_setIfMouseInShape() {
		this._lastmouseinshape = 5;

		var x = mouse.x();
		var y = mouse.y();
		var limit = mouse.limit();

		var startX, endX;
		var startY, endY;

		if (x >= limit.x / 2) {
			startX = Math.trunc(this.columns() / 2) - 1;
			endX = this.columns();
		}
		else {
			startX = 0;
			endX = Math.trunc(this.columns() / 2) + 1;
		}

		if (y >= limit.y / 2) {
			startY = Math.trunc(this.rows() / 2) - 1;
			endY = this.rows();
		}
		else {
			startY = 0;
			endY = Math.trunc(this.rows() / 2) + 1;
		}

		var nearValue = 30;
		var checkDistance;

		for (var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].setMouseIn(false);
			this.shapes[i].setMouseNear(false);
		}

		for (var i = startX; i < endX; i++) {
			for (var j = startY; j < endY; j++) {
				var curShapeIndex = j * this.columns() + i;
				
				if (curShapeIndex >= this.shapes.length)
					continue;

				checkDistance = this.shapes[curShapeIndex].radius() + nearValue; //nearValue >= this.shapes[curShapeIndex].radius() ? nearValue : this.shapes[curShapeIndex].radius();

				if ((x >= this.shapes[curShapeIndex].x() - checkDistance) && (x <= this.shapes[curShapeIndex].x() + checkDistance)) {
					if ((y >= this.shapes[curShapeIndex].y() - checkDistance) && (y <= this.shapes[curShapeIndex].y() + checkDistance)) {
						this.shapes[curShapeIndex].setMouseNear(true);

						checkDistance = this.shapes[curShapeIndex].radius();
						if ((x >= this.shapes[curShapeIndex].x() - checkDistance) && (x <= this.shapes[curShapeIndex].x() + checkDistance)) {
							if ((y >= this.shapes[curShapeIndex].y() - checkDistance) && (y <= this.shapes[curShapeIndex].y() + checkDistance)) {
								this.shapes[curShapeIndex].setMouseIn(true);
							}
						}
					}
				}
			}
		}
	}

	_getChangedShapes() {

	}

	_drawShape(i, layer) {
		var c;

		if (this.shapes[i].radius() <= 0 || this.shapes[i].hidden())
			return;

		this._ctx.globalCompositeOperation = "source-over";

		if (layer === 0) {
			if (this.shapes[i].showPrimary()) { return; }
			else
				c = this._theme.backgroundBase;
		}
		else if (layer === 1) {
			if (this.shapes[i].showPrimary()) { return; }
			else
				c = '#000000';
		}
		else if (layer === 2) {
			if (!this.shapes[i].showPrimary()) { return; }
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
    		return;

    	if (o < 1.0 && layer > 0)
    		this._ctx.globalAlpha = o;

    	this._ctx.beginPath();
    	this.shapes[i].draw(this._ctx);
		
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

	_drawLayer(layer, saveForLast = []) {
		var skipIndex = 0;
		var nextSkip = saveForLast[skipIndex];
		for (let i = 0; i < this.shapes.length; i++) {
			if (i == nextSkip)
				nextSkip = saveForLast[++skipIndex];
			else
				this._drawShape(i, layer);
		}

		for (let i = 0; i < this._panels.length; i++)
			this._drawShape(this._panels[i].shape().id(), layer);

		for (let i = 0; i < this._buttons.length; i++)
			this._drawShape(this._buttons[i].shape().id(), layer);
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

	_drawBackground(saveForLast = []) {
		this._ctx.globalCompositeOperation = "destination-atop";
		this._ctx.fillStyle = this._theme.backgroundBase
		this._ctx.fillRect(0, 0, this._canvasWidth, this._canvasHeight);

		this._drawLayer(0, saveForLast);
	}

	_drawMaskLayer(saveForLast = []) {
		this._drawLayer(1, saveForLast);
	}
	
	_drawTopLayer(saveForLast = []) {
		this._drawLayer(2, saveForLast);
	}
	
	_clearCanvas() {
		this._ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
	}
	
	update(lastTick) {
		if (!this._ready)
			return;

		for (let i = 0; i < this.shapes.length; i++) {
			let result = this.shapes[i].update();

			if (result.deleteShape)
				this.shapes.splice(i--, 1);
			else if (result.buttonShown) {
				result.buttonShown.element.playShowAnimation();

				if (this._bland)
					this.hideInactiveShapes();
			}
			else if (result.panelShown) {
				this.checkLinkRequests();

				if (this._bland)
					this.hideInactiveShapes();
				else
					this.hideShapesCoveredByShape(i);
				//result.panelShown.element.playShowAnimation(); // DOES THIS DO ANYTHING?

				for (let j = 0; j < this._panels.length; j++)
					if (this._panels[j].shape().id() == i)
						this._panels[j].showDefaultContent();
			}
		}

		for (let i = 0; i < this._panels.length; i++)
			this._panels[i].update();
	}

	render() {
		if (!this._ready)
			return;

		if (this._freeze)
			return;

		var changedShapes = this._getChangedShapes();
		this._setIfMouseInShape();

		var renderLast = [];
		for (var i = 0; i < this._buttons.length; i++)
			renderLast.push(this._buttons[i].shape().id());

		for (var i = 0; i < this._panels.length; i++)
			renderLast.push(this._panels[i].shape().id());

		renderLast.sort(function(a, b){return a - b});


		this._clearCanvas();
		this._drawMaskLayer(renderLast);
		this._drawColorLayer();
		this._drawBackground(renderLast);
		this._drawTopLayer(renderLast);
	}

	ctx() 			{ return this._ctx; 			}
	shape() 		{ return this._settings.shape; 	}
	bottom() 		{ return this._rows - 1; 		}
	right() 		{ return this._columns - 1; 	}
	rows() 			{ return this._rows; 			}
	columns() 		{ return this._columns; 		}
	center() { 
		return {
			floor: 		{ x: Math.floor(this._columns / 2), y: Math.floor(this._rows / 2 - 1) 	},
			ceiling: 	{ x: Math.ceil(this._columns / 2), 	y: Math.ceil(this._rows / 2 - 1) 	} 	}; 	}
}
