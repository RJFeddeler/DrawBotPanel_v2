'use strict';

const modButtonRadius = 35;

class UIButton {
	constructor(ctx, id, name, label, icon) {
		if (id >= ui._circles.length)
			return;

		this._ctx 			= ctx;
		this._id 			= id;
		this._name 			= name;
		this._label			= label;
		this._icon 			= icon;

		var m = ui._circles[this._id].getModByName('radius');
		if (m === undefined)
			return;

		var t1 = new Trigger(999, ['doNow'], 'removePassedGoal');
		t1.setPrimaryConsequences({ locked: false, velocity: 0.5 });
		t1.setSecondaryConsequences({ acceleration: -0.25, goal: 0 });
		m.addTrigger(t1);

		var t2 = new Trigger(998, ['passedGoal'], 'removeAtGoal');
		t2.setPrimaryConsequences({ velocity: -1.0 });
		t2.setPassthrough({ pushGoal: true, showPrimaryColor: true, filled: true });
		t2.setSecondaryConsequences({ goal: modButtonRadius, acceleration: 1.0, velocityZero: 2.0, dampen: 1.75, dampenLimit: 9.0 });
		m.addTrigger(t2);

		var t3 = new Trigger(997, ['passedGoal'], 'removeAtGoal');
		t3.setPrimaryConsequences({ });
		t3.setPassthrough({ buttonShown: true });
		t3.setSecondaryConsequences({});
		m.addTrigger(t3);

		var t4 = new Trigger(990, ['mouseXY', 'isIn'], 'resetAtGoal');
		t4.setPrimaryConsequences({ velocity: 1.1 });
		t4.setPassthrough({});
		t4.setSecondaryConsequences({ velocityZero: 0.0, dampen: 1.0, dampenLimit: 0.0 });
		m.addTrigger(t4);

		return this._id;
	}

	showIcon() {
		var div = document.createElement("div");

		div.id = 'button' + this._id;
		this._selector = div.id;
		div.setAttribute('class', 'myButton');
		div.style.top 			= '' + (ui._circles[this._id].y + 25) + 'px';
		div.style.left 			= '' + (ui._circles[this._id].x - 24) + 'px';
		div.style.width 		= '' + modButtonRadius + 'px';
		div.style.height 		= '' + modButtonRadius + 'px';
		div.innerHTML 			= '<i class="fa fa-' + this._icon + ' fa-fw fa-size"></i>';

		document.body.appendChild(div);
		div.addEventListener("mouseover", 	function() { ui.displayHeaderLabel(this._label); }.bind(this));
		div.addEventListener("mouseout", 	function() { ui.clearHeaderLabel(); });
		div.addEventListener("click", 		function() { ui.buttonClick(this._name); }.bind(this));

		var animationName = 'fadeInUpHalf';
		var animationEnd  = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $('#' + this._selector).addClass(animationName).one(animationEnd, function() {
            $(this).removeClass(animationName);
        });
	}

	deleteMe() {
		var m = ui._circles[this.id].getModByName('radius');
		if (m === undefined)
			return;

		var animationName = 'fadeOutDownHalf';
		var animationEnd  = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $('#' + this._selector).addClass(animationName).one(animationEnd, function() {
            $(this).removeClass(animationName);
            $(this).remove();
        });
		
		var t1 = new Trigger(992, ['doNow'], 'removePassedGoal');
		t1.setPrimaryConsequences({ locked: false, velocity: 3.0 });
		t1.setSecondaryConsequences({ acceleration: -0.5, goal: 0 });
		m.addTrigger(t1);

		var t2 = new Trigger(991, ['passedGoal'], 'removeAtGoal');
		t2.setPrimaryConsequences({ velocity: -1.0 });
		t2.setPassthrough({ popGoal: true, showPrimaryColor: false, filled: false });
		t2.setSecondaryConsequences({ acceleration: 1.0, velocityZero: 2.0, dampen: 1.75, dampenLimit: 9.0 });
		m.addTrigger(t2);
	}

	get id() 		{ return this._id; }
}