'use strict';

class UIContainer {
	constructor(source, systemLink, previewLink, previewType, width, height, xOffset, itemWidth, itemHeight, horizontalSpacing, verticalSpacing) {
		this._system = systemLink();

		this._preview = previewLink.searchElement(previewType);

		this._width   	= width;
		this._height  	= height;
		this._xOffset 	= xOffset || 0;

		this._itemWidth  = itemWidth;
		this._itemHeight = itemHeight;

		this._hSpacing = horizontalSpacing;
		this._vSpacing = verticalSpacing;

		this.state = readyState.WAITINGFORDATA;

		this._items = [];
		this._ready = false;

		this._testFiles = [ 'AppoloniusGasket.rob', 'Arrowhead.rob', 'CarsonStipple.rob', 'Declaration.rob', 'GosperCurve.rob', 'HappyBirthday.rob', 'SquiggleGrace.rob', 'WeddingInvite.rob', 'WireSphere.rob', 'Woolf.rob' ];
		this._testFiles.sort(function(a, b) { if (b.fileName < a.fileName) return 1; else return -1; });

		for (let i = 0; i < this._testFiles.length; i++)
			this.addItem( new UIFile( this, i, this._testFiles[i], itemWidth, itemHeight, horizontalSpacing / 2, verticalSpacing / 2 ) );

		this.element = new UIElement('div', 'UIContainer'
			).setStyle('width', this._width
			).setStyle('height', this._height
			).addListener('click', function() { this.hideContextMenus(); }.bind(this)
			).addListener('contextmenu', function() { this.hideContextMenus(); }.bind(this)
			).addListener('mouseleave', function() { this.hideContextMenus(); }.bind(this)
		);

		if (this._xOffset)
			this.element.setStyle('margin-left', this._xOffset);

		return this;
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':
				break;
			case 'Shown':
				break;
		}
	}

	update() {
		if (!this._ready) {
			let progress = 0;
			for (let i = 0; i < this._items.length; i++)
				if (this._items[i].ready())
					progress++;

			progress /= this._items.length;

			if (progress >= 1.0) {
				this._ready = true;
				this.showItems();
			}
		}
	}

	itemClick(index) {
		this._preview.show(this._items[index]);
	}

	itemDraw(index) {
		if (socket)
			socket.emit('drawROB', { filename: this._items[index].filename() });

		this._system.showStopButton();
	}

	addItem(item) {
		return this._items[ this._items.push(item) - 1];
	}

	showItems() {
		for (let i = 0; i < this._items.length; i++)
			this.element.append(this._items[i].domElement());
	}

	hideContextMenus() {
		for (let i = 0; i < this._items.length; i++)
			this._items[i].hideContextMenu();
	}

	showDetails(id) {
		this._system.spawnInfoDialog('Details', '');
	}

	showEdit(id) {
		this._system.freeze();
	}

	showRename(id) {
		this._system.spawnTextDialog('Rename', this._items[id].filename(), this._items[id].filename().split('.')[0]).then(response => {
			if (response.toLowerCase().endsWith('.rob'))
				response = response.slice(0, -4);

			if (socket && response.match(/^[a-zA-Z_-]+$/))
				socket.emit('renameROB', { old: this._items[id].filename(), new: response + '.rob' });

		});
	}

	showCopy(id) {
		this._system.spawnTextDialog('Copy', this._items[id].filename(), this._items[id].filename().split('.')[0]).then(response => {
			if (response.toLowerCase().endsWith('.rob'))
				response = response.slice(0, -4);

			if (socket && response.match(/^[a-zA-Z_-]+$/))
				socket.emit('copyROB', { old: this._items[id].filename(), new: response + '.rob' });

		});
	}

	showDelete(id) {
		this._system.spawnYesNoDialog('Delete', 'Are you sure you want to delete ' + this._items[id].filename() + '?').then(() => {
			if (socket)
				socket.emit('deleteROB', { filename: this._items[id].filename() });

		});
	}

	state() 		{ return this.state; 				}
	domElement() 	{ return this.element.domElement(); }
}