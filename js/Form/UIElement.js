var UIElement_UniqueID = 1;

class UIElement {
	constructor(element, baseClass, sourceType, source, autoWidth = false) {
		this._sourceType 	= sourceType;
		this._source 		= source;
		this._autoWidth 	= autoWidth;

		this._selector 		= '#' + (baseClass || 'Unique') + UIElement_UniqueID++;

		this.element 		= document.createElement(element);
		this.element.id 	= this._selector.slice(1);

		if (baseClass)
			this.setClass(baseClass);

		return this;
	}

	self() 			{ return this.element; 		}
	sourceType() 	{ return this._sourceType; 	}
	source() 		{ return this._source; 		}
	autoWidth() 	{ return this._autoWidth; 	}

	createAnimation(animationShow, animationHide, removeElementOnHide) {
		this._animation = new UIAnimation( this.element, animationShow, animationHide, removeElementOnHide );
	}

	playAnimation() {
		if (this._animation)
			return this._animation.play();
	}

	clear() {
		this.element.innerHTML = '';
		return this;
	}

	html(str) {
		this.element.innerHTML = str;
		return this;
	}

	append(e) {
		this.element.appendChild(e);
		return this;
	}

	setClass(className) {
		this.element.className = className;
		return this;
	}

	addClass(className) {
		this.element.classList.add(className);
		return this;
	}

	removeClass(className) {
		this.element.classList.remove(className);
		return this;
	}

	toggleClass(className) {
		this.element.classList.toggle(className);
		return this;
	}

	getStyle(property) {
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

	setStyle(property, value) {
		switch (property) {
			case 'display':
				this.element.style.display = value;
				break;
			case 'opacity':
				this.element.style.opacity = value;
				break;
			case 'color':
				this.element.style.color = value;
				break;
			case 'left':
				this.element.style.left = value + 'px';
				break;
			case 'right':
				this.element.style.right = value + 'px';
				break;
			case 'top':
				this.element.style.top = value + 'px';
				break;
			case 'bottom':
				this.element.style.bottom = value + 'px';
				break;
			case 'width':
				this.element.style.width = value + 'px';
				break;
			case 'height':
				this.element.style.height = value + 'px';
				break;
		}

		return this;
	}

	changed() {
		return this.changed;
	}
}