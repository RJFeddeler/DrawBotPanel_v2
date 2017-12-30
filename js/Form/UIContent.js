'use strict';

class UIContent {
	constructor(name, id, container, top, bottom, animationArgs) {
		this._name 			= name;
		this._container 	= container;
		this._top 			= top;
		this._bottom 		= bottom;
		this._animationArgs = animationArgs;

		this._trigger = {
			id: id,
			x: container.x(),
			y: container.y(),
			radius: 0,
			color: container.primaryColor()
		};

		this._showing 		= false;

		this._prototype 	= [];
		this._content 		= [];
		this._contentPos 	= [];

		return this;
	}

	update() {
		if (!this._showing)
			return;

		var req;
		for (let i = 0; i < this._content.length; i++) {
			if (this._content[i].update) {
				req = this._content[i].update();

				if (!Array.isArray(req))
					this._handleRequest(req);
				else {
					for (let j = 0; j < req.length; j++)
						this._handleRequest(req[j]);
				}
			}
		}
	}

	updateTrigger(newTrigger) {
		Object.assign(this._trigger, newTrigger);
	}

	_messageChildren(message, value) {
		if (!this._showing)
			return;

		for (let i = 0; i < this._content.length; i++)
			if (this._content[i].handleMessage)
				this._content[i].handleMessage(message, (Array.isArray(value) ? value[i % value.length] : value));
	}

	_handleRequest(req) {
		if (!req)
			return;

		if (req.type === 'Value')
			req.callback('Update', RQGet.value(req.request));
		else if (req.type === 'Collection')
			req.callback('Update', RQGet.collection(req.request));
	}

	render() {
		if (!this._showing)
			return;

		for (let i = 0; i < this._content.length; i++)
			if (this._content[i].changed && this._content[i].changed())
				this._content[i].render();
	}

	show() {
		if (this._showing)
			return;

		var mockup = new UIElement('div', 'UIContent'
			).setStyle('opacity', 	0
			).setStyle('width', 	(this._container.radius() * 2)
			).setStyle('height', 	(this._container.radius() * 2));

		this.generateContent(emptyArray(this._content));
		for (let i = 0; i < this._content.length; i++)
			mockup.append(this._content[i].render());

		document.body.appendChild(mockup.self());

		emptyArray(this._contentPos);
		for (let i = 0; i < this._content.length; i++) {
			this._contentPos.push({
				top: 	this._content[i].element.getStyle('top'),
				height: this._content[i].element.getStyle('height')
			});
		}

		document.body.removeChild(mockup.self());

		let trueTop = this._container.y() - this._container.radius() + this._top;
		let top = Math.max(0, trueTop);
		let trueHeight = (this._container.radius() * 2);
		let height = (top + trueHeight > this._bottom + this._top ? (this._bottom + this._top) - top : (this._container.radius() * 2)); /////////// this._bottom + this._top (top should be footer height)
		//console.log('trueTop: ' + trueTop + ', top: ' + top + ', trueHeight: ' + trueHeight + ', height: ' + height);

		this.element = new UIElement('div', 'UIContent'
			).setStyle('color', 	theme.primaryTextColor
			).setStyle('left', 		this._container.x() - this._container.radius()
			).setStyle('top', 		top
			).setStyle('width', 	this._container.radius() * 2
			).setStyle('height', 	height );

		
		if (top > trueTop) {
			for (let i = 0; i < this._contentPos.length; i++) {
				this._contentPos[i].top += 22;
				//console.log(this._contentPos[i].top);
			}
		}

		for (let i = 0; i < this._content.length; i++) {
			if (this._content[i].element.autoWidth())
				this._content[i].element.setStyle('width', this.getAutoWidthAt(this._contentPos[i].top, this._contentPos[i].height));

			this.element.append(this._content[i].render());
		}

		document.body.appendChild(this.element.self());

		for (let i = 0; i < this._content.length; i++)
			;//this._content[i].element.createAnimation( { name: 'blur', options: 'xs', delay: ((1.0 - (i / this._content.length)) * 300) }, { }, false );

		this.element.createAnimation( { name: 'aroundTheWorldDown', options: 'l' }, { name: 'aroundTheWorldDown-out', options: 'l', endAdjust: -1000 }, true );

		this._showing = true;

		this._messageChildren('Shown', this._contentPos);
	}

	hide() {
		if (!this._showing)
			return;

		this._showing = false;

		let max = 0;
		for (let i = 0; i < this._content.length; i++)
			max = Math.max(max, this._content[i].element.playAnimation());

		return Math.max(max, this.element.playAnimation());
	}

	getAutoWidthAt(top, height = 0, border = 20) {
		let radius 	= this._container.goalRadius();
		//let y 		= Math.max(Math.abs(top - radius), Math.abs((top + height) - radius));
		let y 			= Math.abs(top + (height / 2) - radius);
			
		return (Math.sqrt(radius * radius - y * y) - border) * 2;
	}

	add(type, data) {
		this._prototype.push({ type: type, data: data });

		return this;
	}

	generateContent(contentArray) {
		for (let i = 0; i < this._prototype.length; i++) {
			var element,
				data = this._prototype[i].data;

			switch (this._prototype[i].type) {
				case 'UISpacer':
					element = new UISpacer(data);
					break;
				case 'UISeparator':
					element = new UISeparator(data);
					break;
				case 'UIListItem':
					element = new UIListItem(data.sourceType, data.source, data.size);
					break;
				case 'UISplit':
					element = new UISplit(data);
					break;
				case 'UIStrength':
					element = new UIStrength(data.source, data.segments);
					break;
				case 'UIWell':
					element = new UIWell(data.name, data.source, data.height, this._container.radius(), data.border, data.lineWidth);
					break;
				default:
					break;
			}

			if (element)
				contentArray.push(element);
		}
	}

	delete() {
		emptyArray(this._prototype);
		emptyArray(this._content);
		emptyArray(this._contentPos);

		this.hide();
	}

	name() 		{ return this._name; 		}
	trigger() 	{ return this._trigger; 	}
	showing() 	{ return this._showing; 	}
}