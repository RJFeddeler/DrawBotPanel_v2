'use strict';

class UIMenuSystem {
    constructor(right, bottom, center) {
        //this._right  = right;
        //this._bottom = bottom;
        //this._center = center;
        this._menus  = [];

        this.createMenu('main', [
            { type: 'Button', x: center.floor.x - 2, y: center.ceiling.y + 2, name: 'main_uploadROB', caption: 'Upload .ROB Code', icon: 'file-code-o' },
            { type: 'Button', x: center.floor.x - 3, y: center.ceiling.y, name: 'main_overview', caption: 'Overview', icon: 'search' },
            { type: 'Button', x: center.floor.x - 2, y: center.ceiling.y - 2, name: 'main_freeDraw', caption: 'Free Draw', icon: 'pencil' },
            { type: 'Button', x: center.ceiling.x + 1, y: center.ceiling.y - 2, name: 'main_fileManager', caption: 'File Manager', icon: 'th' },
            { type: 'Button', x: center.ceiling.x + 2, y: center.ceiling.y, name: 'main_settings', caption: 'Settings', icon: 'cogs' },
            { type: 'Button', x: center.ceiling.x + 1, y: center.ceiling.y + 2, name: 'main_uploadIMG', caption: 'Upload Raster Image', icon: 'file-image-o' }
        ], []);

        this.createMenu('overview', [
            { type: 'Panel', x: center.floor.x + 3, y: center.ceiling.y, size: 275, name: 'overview_state', title: 'Overview' },
            { type: 'Panel', x: 4, y: 2, size: 80, name: 'overview_system', title: 'Overview' },
            { type: 'Panel', x: 3, y: center.ceiling.y, size: 80, name: 'overview_memcard', title: 'Overview' },
            { type: 'Panel', x: 4, y: bottom - 2, size: 80, name: 'overview_network', title: 'Overview' }
        ], ['showBackButton']);

        this.createMenu('uploadROB', [], ['showBackButton']);

        this.createMenu('uploadIMG', [], ['showBackButton']);

        this.createMenu('fileManager', [], ['showBackButton']);

        this.createMenu('freeDraw', [
            { type: 'Panel', x: center.floor.x + 3, y: center.ceiling.y, size: 400, name: 'freeDraw_drawingPad', title: 'Drawing Pad' },
            { type: 'Button', x: 2, y: center.ceiling.y - 5, name: 'freeDraw_pencil', caption: 'Pencil', icon: 'pencil' },
            { type: 'Button', x: 2, y: center.ceiling.y - 3, name: 'freeDraw_line', caption: 'Line', icon: 'minus' },
            { type: 'Button', x: 2, y: center.ceiling.y - 1, name: 'freeDraw_rectangle', caption: 'Rectangle', icon: 'square-o' },
            { type: 'Button', x: 2, y: center.ceiling.y + 1, name: 'freeDraw_circle', caption: 'Circle', icon: 'circle-thin' },
            { type: 'Button', x: 2, y: center.ceiling.y + 3, name: 'freeDraw_textH', caption: 'Horizontal Text', icon: 'text-width' },
            { type: 'Button', x: 2, y: center.ceiling.y + 5, name: 'freeDraw_textV', caption: 'Vertical Text', icon: 'text-height' },
            { type: 'Panel', x: 6, y: center.ceiling.y - 3, size: 150, name: 'freeDraw_settings', title: 'Settings' }
        ], ['showBackButton']);

        this.createMenu('settings', [], ['showBackButton']);
    }

    createMenu(name, items, extras) {
        this._menus.push({ name: name, items: items, extras: extras });
    }

    menu(name) {
        for (var i = 0; i < this._menus.length; i++)
            if (this._menus[i].name === name)
                return { items: this._menus[i].items, extras: this._menus[i].extras };

        return { items: [], extras: [] };
    }
}