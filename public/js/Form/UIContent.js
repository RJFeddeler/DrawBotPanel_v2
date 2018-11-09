'use strict';

class UIContent {
	constructor(name, panel, animationArgs) {
		this._name 			= name;
		this._panel			= panel;
		//this._top 		= top;
		//this._height 		= height;
		this._animationArgs = animationArgs;

		this._active 		= false;

		this._prototype 	= [];
		this._contentPos 	= [];
		this._content 		= [];
		this._linkReqs 		= [];
		this._links 		= [];
		
		return this;
	}

	update() {
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

	//updateTrigger(newTrigger) { Object.assign(this._trigger, newTrigger); }

	_messageChildren(message, value) {
		//console.log("UIContent : ~_messageChildren()");
		if (!this._showing)
			return;
		//console.log("UIContent : +_messageChildren(" + message + ", " + value + ")");

		for (let i = 0; i < this._content.length; i++)
			if (this._content[i].handleMessage)
				this._content[i].handleMessage(message, (Array.isArray(value) ? value[i % value.length] : value));
	}

	_handleRequest(req) {
		//console.log("UIContent : ~_handleRequest()");
		if (!req)
			return;
		//console.log("UIContent : +_handleRequest(" + req.request + ")");

		if (req.type === 'Value')
			req.callback('Update', RQGet.value(req.request));
		else if (req.type === 'Collection')
			req.callback('Update', RQGet.collection(req.request));
	}

	show() {
		//console.log("UIContent : ~show()");
		if (this._showing)
			return;
		//console.log("UIContent : +show()");

		this.element = new UIElement('div', 'UIContent'
			).setStyle('opacity', 	0);
			/*
			).setStyle('width', 	(this._panel.shape().radius() * 2)
			).setStyle('height', 	(this._panel.shape().radius() * 2));
			*/

		this.generateContent(emptyArray(this._content), this.element);

		//document.body.appendChild(this.element.domElement());
		this._panel.element.append(this.element.domElement());

		emptyArray(this._contentPos);
		for (let i = 0; i < this._content.length; i++) {
			this._contentPos.push({
				top: 	this._content[i].element.getStyle('top'),
				height: this._content[i].element.getStyle('height')
			});
		}

		let trueTop = this._panel.shape().y() - this._panel.shape().radius() + this._top;
		let top = Math.max(0, trueTop);
		let trueHeight = (this._panel.shape().radius() * 2);
		let height = this._panel.shape().radius() * 2;
		//let height = (top + trueHeight > this._bottom + this._top ? (this._bottom + this._top) - top : (this._panel.shape().radius() * 2)); /////////// this._bottom + this._top (top should be footer height)

		for (let i = 0; i < this._content.length; i++) {
			if (this._content[i].element.autoWidth())
				this._content[i].element.setStyle('width', this.getAutoWidthAt(this._contentPos[i].top, this._contentPos[i].height));

			//this._content[i].element.createAnimation( { name: 'blur', options: 'xs', delay: ((1.0 - (i / this._content.length)) * 300) }, { }, true, false );
		}

		//this.element.createAnimation( { name: 'aroundTheWorldDown', options: 'l' }, { name: 'aroundTheWorldDown-out', options: 'l', endAdjust: -1000 }, true, false );
		this.element.createAnimation( { name: 'blur', options: 'l' }, { name: 'blurLess-out', options: 'l', endAdjust: -1000 }, true, false );

		this._active = true;

		this._messageChildren('Shown', this._contentPos);
	}

	hide() {
		if (!this._active)
			return 0;

		this._active = false;

		let max = 0;
		for (let i = 0; i < this._content.length; i++)
			max = Math.max(max, this._content[i].element.playAnimation());

		return Math.max(max, this.element.playAnimation());
	}

	getAutoWidthAt(top, height = 0, border = 20) {
		let radius 	= this._panel.shape().goalRadius();
		//let y 		= Math.max(Math.abs(top - radius), Math.abs((top + height) - radius));
		let y 			= Math.abs(top + (height / 2) - radius);
			
		return (Math.sqrt(radius * radius - y * y) - border) * 2;
	}

	add(type, data) {
		//console.log("UIContent : add(" + type + ")");
		this._prototype.push({ type: type, data: data });

		return this;
	}

	searchElement(el, occurence = 1) {
		let o = 0;
		for (let i = 0; i < this._content.length; i++)
			if (this._content[i] instanceof el)
				if (++o == occurence)
					return this._content[i];

		return null;
	}

	addLinkReq(req) {
		this._linkReqs.push(req);

		return this;
	}

	transferLink(name, content) {
		this._links.push(
			{
				name: 	name,
				link: 	content
			}
		);
	}

	resolveLink(name) {
		for (let i = 0; i < this._links.length; i++)
			if (this._links[i].name === name)
				return this._links[i].link;
	}

	generateContent(contentArray, element) {
		for (let i = 0; i < this._prototype.length; i++) {
			var data = this._prototype[i].data;

			switch (this._prototype[i].type) {
				case 'UISpacer':
					element.append( contentArray[ contentArray.push( new UISpacer( data ) ) - 1 ].domElement() );
					break;
				case 'UISeparator':
					element.append( contentArray[ contentArray.push( new UISeparator( data ) ) - 1 ].domElement() );
					break;
				case 'UIListItem':
					element.append( contentArray[ contentArray.push( new UIListItem( data.sourceType, data.source, data.size, data.underline ) ) - 1 ].domElement() );
					break;
				case 'UIListItemMatrix':
					let div = document.createElement('div');
					div.className = 'UIListItemMatrix';
					for (let j = 0; j < data.length; j++) {
						let subDiv = document.createElement('div');
						for (let k = 0; k < data[j].length; k++)
							subDiv.appendChild( contentArray[ contentArray.push( new UIListItem( data[j][k].sourceType, data[j][k].source, data[j][k].size ) ) - 1 ].domElement() );
						div.appendChild(subDiv);
					}
					element.append( div );
					break;
				case 'UIBinaryPicker':
					element.append( contentArray[ contentArray.push( new UIBinaryPicker( data.header, data.option1, data.option2, data.headerSize, data.optionSize ) ) - 1 ].domElement() );
					break;
				case 'UIMultiPicker':
					element.append( contentArray[ contentArray.push( new UIMultiPicker( data.header, data.options, data.headerSize, data.optionSize ) ) - 1 ].domElement() );
					break;
				case 'UISlidePicker':
					element.append( contentArray[ contentArray.push( new UISlidePicker( data.label, data.labelSize, data.noUiSliderData ) ) - 1 ].domElement() );
					break;
				case 'UIToggle':
					element.append( contentArray[ contentArray.push( new UIToggle( data.label, data.labelSize, data.onByDefault ) ) - 1 ].domElement() );
					break;
				case 'UINumberBox':
					element.append( contentArray[ contentArray.push( new UINumberBox( data.name, data.defaultValue, data.min, data.max, data.fontSize ) ) - 1 ].domElement() );
					break;
				case 'UISplit':
					element.append( contentArray[ contentArray.push( new UISplit( data ) ) - 1 ].domElement() );
					break;
				case 'UISubmitButton':
					element.append( contentArray[ contentArray.push( new UISubmitButton( this.resolveLink(data.systemLink) ) ) - 1 ].domElement() );
					break;
				case 'UIStrength':
					element.append( contentArray[ contentArray.push( new UIStrength( data.source, data.segments ) ) - 1 ].domElement() );
					break;
				case 'UIWell':
					element.append( contentArray[ contentArray.push( new UIWell( data.source, data.height, this._panel.shape().radius(), data.border, data.lineWidth ) ) - 1 ].domElement() );
					break;
				case 'UICardStack':
					element.append( contentArray[ contentArray.push( new UICardStack( data.source, data.height ) ) - 1 ].domElement() );
					break;
				case 'UICarousel':
					element.append( contentArray[ contentArray.push( new UICarousel( data.source, data.itemWidth, data.itemHeight ) ) - 1 ].domElement() );
					break;
				case 'UIContainer':
					element.append( contentArray[ contentArray.push( new UIContainer( data.source, this.resolveLink(data.systemLink), this.resolveLink(data.previewLink), data.previewType, data.width, data.height, data.xOffset, data.itemWidth, data.itemHeight, data.horizontalSpacing, data.verticalSpacing ) ) - 1 ].domElement() );
					break;
				case 'UISVGPreview':
					element.append( contentArray[ contentArray.push( new UISVGPreview( data.previewWidth, data.previewHeight ) ) - 1 ].domElement() );
					break;
				case 'UICanvas':
					element.append( contentArray[ contentArray.push( new UICanvas( data.width, data.height ) ) - 1 ].domElement() );
					break;
				case 'UILightButton':
					element.append( contentArray[ contentArray.push( new UILightButton( this.resolveLink(data.systemLink), data.cmd, data.label, data.icon ) ) - 1 ].domElement() );
					break;
				default:
					break;
			}
		}
	}

	remove() {
		this.hide();

		emptyArray(this._prototype);
		emptyArray(this._content);
		emptyArray(this._contentPos);
	}

	name() 		{ return this._name; 		}
	active() 	{ return this._active; 		}
	linkReqs() 	{ return this._linkReqs; 	}
}