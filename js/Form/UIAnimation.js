class UIAnimation {
	constructor(element, animationShow, animationHide, removeElementOnHide = false) {
		this._animationShow = {
			name: 		animationShow.name 			|| 'none',
			options: 	animationShow.options 		|| '',
			delay: 		animationShow.delay 		|| 0,
			endAdjust: 	animationShow.endAdjust 	|| 0
		};

		this._animationHide = {
			name: 		animationHide.name 			|| 'none',
			options: 	animationHide.options 		|| '',
			delay: 		animationHide.delay 		|| 0,
			endAdjust: 	animationHide.endAdjust 	|| 0
		};
		
		this._element 				= element;
		this._state 				= 0;
		this._endCounter 			= 0;
		this._removeElementOnHide 	= removeElementOnHide;

		this._element.className 	+= ' anim ' + this._animationShow.name + (this._animationShow.options.length > 0 ? ' ' + this._animationShow.options : '');

		addEventListeners(this._element, 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', this._pause.bind(this));

		this.play();
	}

	duration() {
		let d = window.getComputedStyle(this._element, null).getPropertyValue('animation-duration');
		return parseInt(parseFloat(d) * (d.indexOf('ms') >= 0 ? 1 : 1000));
	}

	play() {
		let delay = (++this._state % 2 ? this._animationShow.delay : this._animationHide.delay);

		if (delay > 0)
			setTimeout(this._play.bind(this), delay);
		else
			this._play();

		return Math.max(0, this.duration() + delay + (this._state % 2 ? this._animationShow.endAdjust : this._animationHide.endAdjust));
	}

	_play() {
		this._endCounter = 0;
		this._element.classList.add('play');
	}

	_pause(event) {
		if (this._element.id !== event.target.id)
			return;

		if (this._endCounter++ >= (this._element.style.animation.match(/,/g) || []).length) {
			this._element.classList.remove('play');

			if (this._state % 2) {
				this._element.classList.remove(this._animationShow.name);
				if (this._animationShow.options.length > 0) {
					this._animationShow.options.split(' ').forEach(c => this._element.classList.remove(c));
				}

				this._element.className += ' ' + this._animationHide.name + (this._animationHide.options.length > 0 ? ' ' + this._animationHide.options : '');
			}
			else {
				this._element.classList.remove('anim', this._animationHide.name);
				if (this._animationHide.options.length > 0) {
					this._animationHide.options.split(' ').forEach(c => this._element.classList.remove(c));
				}

				removeEventListeners(this._element, 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', this._pause.bind(this));

				if (this._removeElementOnHide) {
					if (this._element.parentNode)
						this._element.parentNode.removeChild(this._element);
				}
			}
		}
	}
}