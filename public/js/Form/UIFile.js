'use strict';

class UIFile {
	constructor(container, id, fileName, width, height, marginX, marginY) {
		this._container 	= container;
		this._id 			= id;

		this._ready 		= false;
		this._fileName 		= fileName;

		this._width 		= width;
		this._height 		= height;

		this._marginX 		= marginX;
		this._marginY 		= marginY;

		this.element  = new UIElement('div', 'UIFile'
			).setStyle('width', this._width
			).setStyle('height', this._height
			).setStyle('margin-x', this._marginX
			).setStyle('margin-y', this._marginY
		);

		this._contextMenu = new UIElement('div', 'UIFileContextMenu'
			).html('<p>Details</p><p>Edit</p><p>Rename</p><p>Copy</p><p>Delete</p>'
			).addListener('click', function(e) { e.stopPropagation(); this.hideContextMenu(); this.handleContextClick(e.target.innerHTML); }.bind(this)
		);

		SVG.pathsFromROB('public/art/' + this._fileName).then((file) => {
			this._svg 			= file.svg;
			this._title 		= file.header.title 		|| 'No Title';
			this._date 			= file.header.creationDate 	|| '01.01.1900';
			this._size 			= file.header.fileSize 		|| 0;
			this._lineCount 	= file.header.lineCount 	|| 0;
			this._lineLength 	= file.header.lineLength 	|| 0;

			this.element.html('<a><i class="fas fa-file-image"></i><p class="UIFile_Text">' + this._fileName + '</p></a>'
				).append(this._contextMenu.domElement()
				).addListener('click', function() { this._container.itemClick(this._id); }.bind(this)
				).addListener('contextmenu', function(e) { e.preventDefault(); e.stopPropagation(); this._container.hideContextMenus(); this._contextMenu.addClass('active'); return false; }.bind(this)
			);
			
			this._ready = true;
		}).catch(error => {
			console.log("Error: " + error);
		});
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':
				break;
			case 'Shown':
				break;
		}
	}

	handleContextClick(target) {
		switch (target.toLowerCase()) {
			case 'details':
				this._container.showDetails(this._id);
				break;
			case 'edit':
				this._container.showEdit(this._id);
				break;
			case 'rename':
				this._container.showRename(this._id);
				break;
			case 'copy':
				this._container.showCopy(this._id);
				break;
			case 'delete':
				this._container.showDelete(this._id);
				break;
		}
	}

	update() {
	}

	hideContextMenu() {
		this._contextMenu.removeClass('active');
	}

	estimateTime() {
		return 10921;
	}

	id() 			{ return this._id; 						}
	container() 	{ return this._container; 				}

	svg() 			{ return this._svg; 					}
	filename() 		{ return this._fileName; 				}
	title() 		{ return this._fileName.toLowerCase().endsWith('.rob') ? this._fileName.slice(0, -4) : this._fileName; }
	size() 			{ return this._size; 					}
	date() 			{ return this._date; 					}
	lineCount() 	{ return this._lineCount; 				}
	lineLength() 	{ return this._lineLength; 				}
	ready() 		{ return this._ready;					}
	domElement() 	{ return this.element.domElement(); 	}
}