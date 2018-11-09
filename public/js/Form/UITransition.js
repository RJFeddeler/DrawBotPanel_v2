class UITransition {
	constructor(element, animationShow, animationHide, playOnCreation = true) {
		this._element = element;
		this._state = 0;

		this._element.className += '';

		addEventListeners(this._element, 'webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend', this._pause.bind(this));

		if (playOnCreation)
			this.play();
	}
}