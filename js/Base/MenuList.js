'use strict';

class MenuList {
	constructor(right, bottom, center) {
		const XSlow = 5, Slow = 10, Med = 25, Fast = 40, XFast = 100;
		this._currentMenu = -1;
		this._menus = [];

		this.createMenu('M.Main', Med,
			[{
				name: 'M.Main_B.UploadROB',
				type: 'Button',
				event: 'Menu',
				eventArg: 'M.UploadROB',
				x: center.floor.x - 2,
				y: center.ceiling.y + 2,
				text: 'Upload .ROB Code',
				icon: 'file-code-o',
				fancy: false
			},
			{
				name: 'M.Main_B.Overview',
				type: 'Button',
				event: 'Menu',
				eventArg: 'M.Overview',
				x: center.floor.x - 3,
				y: center.ceiling.y,
				text: 'Overview',
				icon: 'search',
				fancy: false
			},
			{
				name: 'M.Main_B.FreeDraw',
				type: 'Button',
				event: 'Menu',
				eventArg: 'M.FreeDraw',
				x: center.floor.x - 2,
				y: center.ceiling.y - 2,
				text: 'Free Draw',
				icon: 'pencil',
				fancy: false
			},
			{
				name: 'M.Main_B.Files',
				type: 'Button',
				event: 'Menu',
				eventArg: 'M.Files',
				x: center.ceiling.x + 1,
				y: center.ceiling.y - 2,
				text: 'File Manager',
				icon: 'th',
				fancy: false
			},
			{
				name: 'M.Main_B.Settings',
				type: 'Button',
				event: 'Menu',
				eventArg: 'M.Settings',
				x: center.ceiling.x + 2,
				y: center.ceiling.y,
				text: 'Settings',
				icon: 'cogs',
				fancy: false
			},
			{
				name: 'M.Main_B.UploadIMG',
				type: 'Button',
				event: 'Menu',
				eventArg: 'M.UploadIMG',
				x: center.ceiling.x + 1,
				y: center.ceiling.y + 2,
				text: 'Upload Raster Image',
				icon: 'file-image-o',
				fancy: false
			}
		], []);


		this.createMenu('M.Overview', Med,
			[{
				name: 'M.Overview_P.State',
				type: 'Panel',
				x: center.floor.x + 3,
				y: center.ceiling.y,
				radius: 400
			},
			{
				name: 'M.Overview_P.Info',
				type: 'Panel',
				x: 3,
				y: center.ceiling.y,
				radius: 140,
				defaultContent: 'M.Overview_P.Info_C.System'
			},
			{
				name: 'M.Overview_B.Network',
				type: 'Button',
				event: 'Content',
				eventArg: 'M.Overview_P.Info_C.Network',
				x: 1,
				y: center.ceiling.y + 4,
				text: 'Network',
				icon: 'wifi',
				fancy: true
			},
			{
				name: 'M.Overview_B.System',
				type: 'Button',
				event: 'Content',
				eventArg: 'M.Overview_P.Info_C.System',
				x: 3,
				y: center.ceiling.y + 4,
				text: 'System',
				icon: 'microchip',
				fancy: true
			},
			{
				name: 'M.Overview_B.Storage',
				type: 'Button',
				event: 'Content',
				eventArg: 'M.Overview_P.Info_C.Storage',
				x: 5,
				y: center.ceiling.y + 4,
				text: 'Storage',
				icon: 'hdd-o',
				fancy: true
			}
		], ['showBackButton']);


		this.createMenu('M.UploadROB', Med,
			[
		], ['showBackButton']);


		this.createMenu('M.UploadIMG', Med,
			[
		], ['showBackButton']);


		this.createMenu('M.Files', Med,
			[{
				name: 'M.Files_P.FileManager',
				type: 'Panel',
				x: center.floor.x + 2,
				y: center.ceiling.y,
				radius: 400,
				defaultContent: 'M.Files_P.FileManager_C.FileManager'
			}
		], ['showBackButton']);


		this.createMenu('M.FreeDraw', Med,
			[{
				name: 'M.FreeDraw_P.DrawingPad',
				type: 'Panel',
				x: center.floor.x - 1,
				y: center.ceiling.y,
				radius: 400 },
			{
				name: 'M.FreeDraw_B.Pencil',
				type: 'Button',
				event: '',
				eventArg: '',
				x: 2,
				y: center.ceiling.y - 5,
				text: 'Pencil',
				icon: 'pencil',
				fancy: false
			},
			{
				name: 'M.FreeDraw_B.Line',
				type: 'Button',
				event: '',
				eventArg: '',
				x: 2,
				y: center.ceiling.y - 3,
				text: 'Line',
				icon: 'minus',
				fancy: false
			},
			{
				name: 'M.FreeDraw_B.Rectangle',
				type: 'Button',
				event: '',
				eventArg: '',
				x: 2,
				y: center.ceiling.y - 1,
				text: 'Rectangle',
				icon: 'square-o',
				fancy: false
			},
			{
				name: 'M.FreeDraw_B.Circle',
				type: 'Button',
				event: '',
				eventArg: '',
				x: 2,
				y: center.ceiling.y + 1,
				text: 'Circle',
				icon: 'circle-thin',
				fancy: false
			},
			{
				name: 'M.FreeDraw_B.TextH',
				type: 'Button',
				event: '',
				eventArg: '',
				x: 2,
				y: center.ceiling.y + 3,
				text: 'Horizontal Text',
				icon: 'text-width',
				fancy: false
			},
			{
				name: 'M.FreeDraw_B.TextV',
				type: 'Button',
				event: '',
				eventArg: '',
				x: 2,
				y: center.ceiling.y + 5,
				text: 'Vertical Text',
				icon: 'text-height',
				fancy: false
			},
			{
				name: 'M.FreeDraw_P.Properties',
				type: 'Panel',
				x: right - 3,
				y: bottom - 3,
				radius: 150
			}
		], ['showBackButton']);


		this.createMenu('M.Settings', Med,
			[
		], ['showBackButton']);
	}

	createMenu(name, speed, items, extras) {
		this._menus.push({ name: name, speed: speed, items: items, extras: extras });
	}

	get(name) {
		for (var i = 0; i < this._menus.length; i++)
			if (this._menus[i].name === name) {
				this._currentMenu = i;
				return { speed: this._menus[i].speed, items: this._menus[i].items, extras: this._menus[i].extras };
			}

		return { items: [], extras: [] };
	}

	itemCount() { return this._menus[this._currentMenu].items.length; }
}