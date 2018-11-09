var UIElement_UniqueID = 1;

class UIElement {
	constructor(element, baseClass, autoWidth = false) { // sourceType, source
		//this._sourceType 	= sourceType;
		//this._source 		= source;
		this._autoWidth 	= autoWidth;

		this.element 		= document.createElement(element);
		//this.element.id 	= this._selector.slice(1);

		if (baseClass)
			this.setClass(baseClass);

		return this;
	}

	domElement() 	{ return this.element; 		}
	//sourceType() 	{ return this._sourceType; 	}
	//source() 		{ return this._source; 		}
	autoWidth() 	{ return this._autoWidth; 	}

	createAnimation(animationShow, animationHide, playOnCreation, removeElementOnHide) {
		//console.log("UIElement : [ " + this._selector + " ].createAnimation()");
		this._animation = new UIAnimation( this.element, animationShow, animationHide, playOnCreation, removeElementOnHide );
		return this;
	}

	playAnimation() {
		//console.log("UIElement : [ " + this._selector + " ].playAnimation()");
		if (this._animation)
			return this._animation.play();
	}

	playShowAnimation() {
		if (this._animation)
			return this._animation.playShow();
	}

	playHideAnimation() {
		if (this._animation)
			return this._animation.playHide();
	}

	id(str) {
		this.element.setAttribute("id", str);
		return this;
	}

	clear() {
		//console.log("UIElement : [ " + this._selector + " ].clear()");
		this.element.innerHTML = '';
		return this;
	}

	remove() {
		if (this.element.parentNode)
			this.element.parentNode.removeChild(this.element);
	}

	html(str) {
		//console.log("UIElement : [ " + this._selector + " ].html(" + str + ")");
		this.element.innerHTML = str;
		return this;
	}

	append(e) {
		//console.log("UIElement : [ " + this._selector + " ].append(" + e + ")");
		this.element.appendChild(e);
		return this;
	}

	appendTo(e) {
		e.appendChild(this.element);
		return this;
	}

	setClass(className) {
		//console.log("UIElement : [ " + this._selector + " ].setClass(" + className + ")");
		this.element.className = className;
		return this;
	}

	addClass(className) {
		//console.log("UIElement : [ " + this._selector + " ].addClass(" + className + ")");
		this.element.classList.add(className);
		return this;
	}

	removeClass(className) {
		//console.log("UIElement : [ " + this._selector + " ].removeClass(" + className + ")");
		this.element.classList.remove(className);
		return this;
	}

	toggleClass(className) {
		//console.log("UIElement : [ " + this._selector + " ].toggleClass(" + className + ")");
		this.element.classList.toggle(className);
		return this;
	}

	addListener(event, func) {
		this.element.addEventListener(event, func);
		return this;
	}

	query(selector) {
		return this.element.querySelector(selector);
	}

	queryAll(selector) {
		return this.element.querySelectorAll(selector);
	}

	getStyle(property) {
		//console.log("UIElement : [ " + this._selector + " ].getStyle(" + property + ")");
		switch (property) {
			case 'top':
				return this.element.getBoundingClientRect().top;
			case 'bottom':
				return this.element.getBoundingClientRect().bottom;
			case 'left':
				return this.element.getBoundingClientRect().left;
			case 'right':
				return this.element.getBoundingClientRect().right;
			case 'width':
				return this.element.getBoundingClientRect().width;
			case 'height':
				return this.element.getBoundingClientRect().height;
		}
	}

	setStyle(property, value, hasUnit = false) {
		//console.log("UIElement : [ " + this._selector + " ].setStyle(" + property + ") = " + value);
		switch (property) {
			case 'display':
				this.element.style.display = value;
				break;
			case 'margin':
				this.element.style.margin = value + (hasUnit ? '' : 'px');
				break;
			case 'margin-x':
				this.element.style.marginLeft = value + (hasUnit ? '' : 'px');
				this.element.style.marginRight = value + (hasUnit ? '' : 'px');
				break;
			case 'margin-y':
				this.element.style.marginTop = value + (hasUnit ? '' : 'px');
				this.element.style.marginBottom = value + (hasUnit ? '' : 'px');
				break;
			case 'margin-left':
				this.element.style.marginLeft = value + (hasUnit ? '' : 'px');
				break;
			case 'margin-right':
				this.element.style.marginRight = value + (hasUnit ? '' : 'px');
				break;
			case 'margin-top':
				this.element.style.marginTop = value + (hasUnit ? '' : 'px');
				break;
			case 'margin-bottom':
				this.element.style.marginBottom = value + (hasUnit ? '' : 'px');
				break;
			case 'zIndex':
				this.element.style.zIndex = value;
				break;
			case 'opacity':
				this.element.style.opacity = value;
				break;
			case 'transform':
				this.element.style.transform = value;
				break;
			case 'color':
				this.element.style.color = value;
				break;
			case 'left':
				this.element.style.left = value + (hasUnit ? '' : 'px');
				break;
			case 'right':
				this.element.style.right = value + (hasUnit ? '' : 'px');
				break;
			case 'top':
				this.element.style.top = value + (hasUnit ? '' : 'px');
				break;
			case 'bottom':
				this.element.style.bottom = value + (hasUnit ? '' : 'px');
				break;
			case 'width':
				this.element.style.width = value + (hasUnit ? '' : 'px');
				break;
			case 'height':
				this.element.style.height = value + (hasUnit ? '' : 'px');
				break;
			case 'backgroundImage':
				this.element.style.backgroundImage = value;
				break;
		}

		return this;
	}
}