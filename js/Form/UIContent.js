'use strict';

class UIContent {
	constructor(name, id, container, topOffset) {
		this._name 		= name;
		this._container = container;
		this._topOffset = parseInt(topOffset);

		this._trigger 	= {
			id: id,
			x: container.x(),
			y: container.y(),
			radius: 0,
			color: container.primaryColor()
		};

		this._selector 	= '#Content' + this._container.id() + this._trigger.id;
		this._showing 	= false;
		this._content 	= [];

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

	updateTrigger(newTrigger) {
		Object.assign(this._trigger, newTrigger);
	}

	_messageChildren(message, value) {
		for (let i = 0; i < this._content.length; i++)
			if (this._content[i].handleMessage)
				this._content[i].handleMessage(message, value);
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
		for (let i = 0; i < this._content.length; i++)
			if (this._content[i].changed && this._content[i].changed())
				this._content[i].render();
	}

	show() {
		var div = document.createElement("div");

		div.id = this._selector.slice(1);
		div.setAttribute('class', 'UIContent');

		div.style.color  	= theme.primaryTextColor;
		div.style.left 		= (this._container.x() - this._container.radius()) + 'px';
		div.style.top 		= (this._container.y() - this._container.radius() + this._topOffset) + 'px';
		div.style.width 	= (this._container.radius() * 2) + 'px';
		div.style.height 	= (this._container.radius() * 2) + 'px';


		for (let i = 0; i < this._content.length; i++)
			div.appendChild(this._content[i].render());

		document.body.appendChild(div);

		var radius = this._container.goalRadius();
		$('.autoWidth').each(function(i, j) {
			let border = 20;
			let y = $(this).position().top;

			if ($(j).hasClass('separatorBottom'))
				y += $(this).height();

			let w = (2 * Math.sqrt((radius * radius) - ((y - radius) * (y - radius)))) - (border * 2);
			$(j).css('width', w + 'px');
		});

		var animationName = 'fadeInUp';
		if (this._trigger.x < this._container.x())
			animationName += 'Right';
		else if (this._trigger.x > this._container.x())
			animationName += 'Left';

		var animationEnd  = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		$(this._selector).addClass(animationName).one(animationEnd, function() {
            $(this._selector).removeClass(animationName);
            this._messageChildren('Shown', $(this._selector).offset());
        }.bind(this));

        this._showing = true;
	}

	hide() {
		var animationEnd  = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		var animationName = 'fadeOutDown';
		if (this._trigger.x < this._container.x())
			animationName += 'Left';
		else if (this._trigger.x > this._container.x())
			animationName += 'Right';

		this._showing = false;
        $(this._selector).addClass(animationName).one(animationEnd, function() {
            $(this).remove();
        });
	}

	add(type, data) {
		var element;
		switch (type) {
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
			this._content.push(element);

		return this;
	}

	delete() {
		this.hide();
	}

	name() 		{ return this._name; 		}
	trigger() 	{ return this._trigger; 	}
	showing() 	{ return this._showing; 	}
}