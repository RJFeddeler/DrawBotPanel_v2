'use strict';

class UIPanel {
	constructor(ctx, x, y, radius, name, title) {
		this._ctx 			= ctx;
		this._radius 		= radius;
		this._name 			= name;
		this._title			= title;

		if (x >= ui._columns) 	x = ui._columns - 1;
		if (y >= ui._rows) 		y = ui._rows - 1;

		this._id 			= y * ui._columns + x;

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
		t2.setSecondaryConsequences({ goal: this._radius, acceleration: 0.5, velocityZero: 2.0, dampen: 1.75, dampenLimit: 9.0 });
		m.addTrigger(t2);

		var t3 = new Trigger(990, ['atGoal']);
		t3.setPrimaryConsequences({ locked: false });
		t3.setPassthrough({});
		t3.setSecondaryConsequences({});
		m.addTrigger(t3);

		return this._id;
	}

	mouseMove() {

	}

	mouseDown() {

	}

	deleteMe() {
		var m = ui._circles[this._id].getModByName('radius');
		if (m === undefined)
			return;

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
	set id(value) 	{ this._id = value; }
}