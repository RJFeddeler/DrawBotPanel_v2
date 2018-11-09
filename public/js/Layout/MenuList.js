'use strict';

class MenuList {
	constructor(right, bottom, center) {
		const XSlow = 5, Slow = 10, Med = 25, Fast = 40, XFast = 100;
		this._currentMenu = -1;
		this._menus = [];

		this.createMenu('M.Main', Med, false,
			[{
				type: 'Button',
				event: 'Menu',
				eventArg: 'M.LoadSVG',
				x: center.floor.x - 2,
				y: center.ceiling.y + 2,
				label: 'Load SVG',
				icon: 'file-code'
			},
			{
				type: 'Button',
				event: 'Menu',
				eventArg: 'M.Information',
				x: center.floor.x - 3,
				y: center.ceiling.y,
				label: 'Information',
				icon: 'info'
			},
			{
				type: 'Button',
				event: 'Menu',
				eventArg: 'M.FreeDraw',
				x: center.floor.x - 2,
				y: center.ceiling.y - 2,
				label: 'Free Draw',
				icon: 'pencil-alt'
			},
			{
				type: 'Button',
				event: 'Menu',
				eventArg: 'M.FileManager',
				x: center.ceiling.x + 1,
				y: center.ceiling.y - 2,
				label: 'File Manager',
				icon: 'th'
			},
			{
				type: 'Button',
				event: 'Menu',
				eventArg: 'M.Settings',
				x: center.ceiling.x + 2,
				y: center.ceiling.y,
				label: 'Settings',
				icon: 'cogs'
			},
			{
				type: 'Button',
				event: 'Menu',
				eventArg: 'M.LoadIMG',
				x: center.ceiling.x + 1,
				y: center.ceiling.y + 2,
				label: 'Load Raster Image',
				icon: 'file-image'
			}
		]);


		this.createMenu('M.Information', Med, true,
			[{
				name: 'M.Information_P.State',
				type: 'Panel',
				x: center.floor.x + 3,
				y: center.ceiling.y,
				radius: 400
			},
			{
				name: 'M.Information_P.Info',
				type: 'Panel',
				x: 3,
				y: center.ceiling.y,
				radius: 140,
				defaultContent: 'M.Information_P.Info_C.System'
			},
			{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.Information_P.Info_C.Network',
				x: 1,
				y: center.ceiling.y + 4,
				label: 'Network',
				icon: 'wifi'
			},
			{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.Information_P.Info_C.System',
				x: 3,
				y: center.ceiling.y + 4,
				label: 'System',
				icon: 'microchip'
			},
			{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.Information_P.Info_C.Storage',
				x: 5,
				y: center.ceiling.y + 4,
				label: 'Storage',
				icon: 'hdd'
			}
		]);


		this.createMenu('M.LoadSVG', Med, true,
			[
			{
				name: 'M.LoadSVG_P.Preview',
				type: 'Panel',
				x: center.floor.x - 3,
				y: center.ceiling.y,
				radius: 400
			},
			{
				type: 'Button',
				event: 'Command',
				eventArg: 'M.LoadSVG_P.Preview_CMD.LoadFile',
				x: 1,
				y: 1,
				label: 'Load SVG File',
				icon: 'upload'
			}
		]);


		this.createMenu('M.LoadIMG', Med, true,
			[
			{
				name: 'M.LoadIMG_P.Preview',
				type: 'Panel',
				x: center.floor.x - 3,
				y: center.ceiling.y,
				radius: 400
			},
			{
				name: 'M.LoadIMG_P.Gaussian',
				type: 'Panel',
				x: center.floor.x + 7,
				y: center.ceiling.y - 4,
				radius: 120
			},
			{
				name: 'M.LoadIMG_P.Canny',
				type: 'Panel',
				x: center.floor.x + 8,
				y: center.ceiling.y,
				radius: 120
			},
			{
				name: 'M.LoadIMG_P.Filters',
				type: 'Panel',
				x: center.floor.x + 7,
				y: center.ceiling.y + 4,
				radius: 120
			},
			{
				type: 'Button',
				event: 'Command',
				eventArg: 'M.LoadIMG_P.Preview_CMD.LoadFile',
				x: 1,
				y: 1,
				label: 'Load Image File',
				icon: 'upload'
			}
		]);


		this.createMenu('M.FreeDraw', Med, true,
			[{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.FreeDraw_P.Properties_C.Move',
				x: center.floor.x - 10,
				y: 1,
				label: 'Move',
				icon: 'arrows-alt'
			},
			{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.FreeDraw_P.Properties_C.Line',
				x: center.floor.x - 8,
				y: 1,
				label: 'Draw Line',
				icon: 'minus'
			},
			{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.FreeDraw_P.Properties_C.Arc',
				x: center.floor.x - 6,
				y: 1,
				label: 'Draw Arc',
				icon: 'circle-notch'
			},
			{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.FreeDraw_P.Properties_C.Text',
				x: center.floor.x - 4,
				y: 1,
				label: 'Draw Text',
				icon: 'font'
			},
			{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.FreeDraw_P.Properties_C.Freehand',
				x: center.floor.x - 2,
				y: 1,
				label: 'Draw Freehand',
				icon: 'mouse-pointer'
			},
			{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.FreeDraw_P.Properties_C.Effector',
				x: center.floor.x + 2,
				y: 1,
				label: 'Raise/Lower Effector',
				icon: 'arrows-alt-v'
			},
			{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.FreeDraw_P.Properties_C.Home',
				x: center.floor.x + 4,
				y: 1,
				label: 'Home Axis',
				icon: 'map-marker-alt'
			},
			{
				type: 'Button',
				event: 'Command',
				eventArg: 'M.FreeDraw_P.Properties_CMD.DisableStepperMotors',
				x: center.floor.x + 6,
				y: 1,
				label: 'Disable Stepper Motors',
				icon: 'ban'
			},
			{
				type: 'Button',
				event: 'Command',
				eventArg: 'M.FreeDraw_P.Properties_CMD.CancelAction',
				x: center.floor.x + 9,
				y: 1,
				label: 'Cancel Action',
				icon: 'hand-paper'
			},
			{
				type: 'Panel',
				name: 'M.FreeDraw_P.Console',
				x: center.floor.x - 1,
				y: center.ceiling.y,
				radius: 400
			},
			{
				type: 'Panel',
				name: 'M.FreeDraw_P.Properties',
				x: right - 3,
				y: bottom - 3,
				radius: 150
			}
		]);


		this.createMenu('M.Settings', Med, true,
			[
		]);


		this.createMenu('M.FileManager', Med, true,
			[
			{
				name: 'M.FileManager_P.FileManager',
				type: 'Panel',
				x: center.floor.x + 2,
				y: center.ceiling.y,
				radius: 400
			},
			{
				name: 'M.FileManager_P.Preview',
				type: 'Panel',
				x: center.floor.x - 7,
				y: bottom - 4,
				radius: 200
			}
		]);


		this.createMenu('M.EditROB', Med, true,
			[
			{
				name: 'M.EditROB_P.Preview',
				type: 'Panel',
				x: center.floor.x - 3,
				y: center.ceiling.y,
				radius: 400
			},
			{
				name: 'M.EditROB_P.Options',
				type: 'Panel',
				x: center.floor.x + 7,
				y: center.ceiling.y,
				radius: 120
			},
			{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.EditROB_P.Options_C.PrintArea',
				x: 1,
				y: center.ceiling.y + 4,
				label: 'Network',
				icon: 'wifi'
			},
			{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.EditROB_P.Options_C.',
				x: 3,
				y: center.ceiling.y + 4,
				label: 'System',
				icon: 'microchip'
			},
			{
				type: 'Button',
				event: 'Content',
				eventArg: 'M.EditROB_P.Options_C.Storage',
				x: 5,
				y: center.ceiling.y + 4,
				label: 'Storage',
				icon: 'hdd'
			}
		]);

	}

	createMenu(name, speed, showBackButton, items) {
		this._menus.push({ name: name, speed: speed, showBackButton: showBackButton, items: items });
	}

	get(name) {
		for (var i = 0; i < this._menus.length; i++)
			if (this._menus[i].name === name) {
				this._currentMenu = i;
				return { speed: this._menus[i].speed, showBackButton: this._menus[i].showBackButton, items: this._menus[i].items };
			}

		return { items: [] };
	}

	itemCount() { return this._menus[this._currentMenu].items.length; }
}