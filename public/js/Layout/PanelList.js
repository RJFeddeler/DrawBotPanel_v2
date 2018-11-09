'use strict';

var PanelList = {
	get(panelName, panel) {
		switch(panelName) {
			case 'M.FreeDraw_P.Properties':
				return [
					new UIContent('M.FreeDraw_P.Properties_C.Move', panel
						).add('UIBinaryPicker',
						{
							header: 'Arm',
							option1: 'Left',
							option2: 'Right',
							headerSize: 'Font_H2',
							optionSize: 'Font_H4'
						}
						).add('UIBinaryPicker',
						{
							header: 'Position',
							option1: 'Absolute',
							option2: 'Relative',
							headerSize: 'Font_H2',
							optionSize: 'Font_H4'
						}
						).add('UISplit', 
						[ [
							{
								name: 'X',
								type: 'UINumberBox',
								defaultValue: 0.0,
								min: 0.0,
								max: 350.0,
								size: 'Font_H6'
							},
							{
								name: 'Y',
								type: 'UINumberBox',
								defaultValue: 0.0,
								min: 0.0,
								max: 350.0,
								size: 'Font_H6'
							},
							{
								name: 'Velocity',
								type: 'UINumberBox',
								defaultValue: 0.0,
								min: 0.0,
								max: 350.0,
								size: 'Font_H6'
							}
						] ]
						).add('UISubmitButton'
						),
					new UIContent('M.FreeDraw_P.Properties_C.Line', panel
						).add('UIBinaryPicker',
						{
							header: 'Arm',
							option1: 'Left',
							option2: 'Right',
							headerSize: 'Font_H2',
							optionSize: 'Font_H4'
						}
						).add('UIBinaryPicker',
						{
							header: 'Position',
							option1: 'Absolute',
							option2: 'Relative',
							headerSize: 'Font_H2',
							optionSize: 'Font_H4'
						}
						).add('UISplit', 
						[ [
							{
								name: 'X',
								type: 'UINumberBox',
								defaultValue: 0.0,
								min: 0.0,
								max: 350.0,
								size: 'Font_H6'
							},
							{
								name: 'Y',
								type: 'UINumberBox',
								defaultValue: 0.0,
								min: 0.0,
								max: 350.0,
								size: 'Font_H6'
							},
							{
								name: 'Velocity',
								type: 'UINumberBox',
								defaultValue: 0.0,
								min: 0.0,
								max: 350.0,
								size: 'Font_H6'
							}
						] ]
						).add('UISubmitButton'
						),
					new UIContent('M.FreeDraw_P.Properties_C.Arc', panel
						).add('UIBinaryPicker',
						{
							header: 'Arm',
							option1: 'Left',
							option2: 'Right',
							headerSize: 'Font_H2',
							optionSize: 'Font_H4'
						}
						).add('UISplit', 
						[ [
							{
								source: 'Center',
								type: 'UIListItem',
								sourceType: 'Static',
								size: 'H4',
								underline: false
							},
							{
								name: 'X',
								type: 'UINumberBox',
								defaultValue: 0.0,
								min: 0.0,
								max: 350.0,
								size: 'Font_H6'
							},
							{
								name: 'Y',
								type: 'UINumberBox',
								defaultValue: 0.0,
								min: 0.0,
								max: 350.0,
								size: 'Font_H6'
							}
						] ]
						).add('UISplit', 
						[ [
							{
								source: 'Radius',
								type: 'UIListItem',
								sourceType: 'Static',
								size: 'H4',
								underline: false
							},
							{
								name: 'X',
								type: 'UINumberBox',
								defaultValue: 0.0,
								min: 0.0,
								max: 350.0,
								size: 'Font_H6'
							},
							{
								name: 'Y',
								type: 'UINumberBox',
								defaultValue: 0.0,
								min: 0.0,
								max: 350.0,
								size: 'Font_H6'
							}
						] ]
						).add('UISplit', 
						[ [
							{
								source: 'Angle',
								type: 'UIListItem',
								sourceType: 'Static',
								size: 'H4',
								underline: false
							},
							{
								name: 'Start',
								type: 'UINumberBox',
								defaultValue: 0.0,
								min: 0.0,
								max: 350.0,
								size: 'Font_H6'
							},
							{
								name: 'End',
								type: 'UINumberBox',
								defaultValue: 0.0,
								min: 0.0,
								max: 350.0,
								size: 'Font_H6'
							}
						] ]
						).add('UISubmitButton'
						),
					new UIContent('M.FreeDraw_P.Properties_C.Text', panel
						).add('UIBinaryPicker',
						{
							header: 'Arm',
							option1: 'Left',
							option2: 'Right',
							headerSize: 'Font_H2',
							optionSize: 'Font_H4'
						}
						),
					new UIContent('M.FreeDraw_P.Properties_C.Freehand', panel
						).add('UIBinaryPicker',
						{
							header: 'Arm',
							option1: 'Left',
							option2: 'Right',
							headerSize: 'Font_H2',
							optionSize: 'Font_H4'
						}
						),
					new UIContent('M.FreeDraw_P.Properties_C.Effector', panel
						).add('UIBinaryPicker',
						{
							header: 'Arm',
							option1: 'Left',
							option2: 'Right',
							headerSize: 'Font_H2',
							optionSize: 'Font_H4'
						}
						).add('UISlidePicker',
						{
							label: 'Z',
							labelSize: 'Font_H4',
							noUiSliderData: {
								range: {
									'min': 0.0,
									'max': 1.0
								},
								start: [0.5],
								step: 0.01,
								tooltips: wNumb({ decimals: 2 }),
								behaviour: 'snap'
							}
						}
						).add('UISubmitButton',
						{
							systemLink: 'S.System_CMD.GetSharedSystemFunctions'
						}
						).addLinkReq('S.System_CMD.GetSharedSystemFunctions'
						),
					new UIContent('M.FreeDraw_P.Properties_C.Home', panel
						/*
							<a class='dropdown-trigger btn' href='#' data-target='dropdown1'>Drop Me!</a>
							<ul id='dropdown1' class='dropdown-content'>
							<li><a href="#!">one</a></li>
							<li class="divider" tabindex="-1"></li>
							<li><a href="#!">two</a></li>
							<li><a href="#!"><i class="material-icons">view_module</i>three</a></li>
							</ul>
						*/
						/*
							document.addEventListener('DOMContentLoaded', function() {
								var elems = document.querySelectorAll('.dropdown-trigger');
								var instances = M.Dropdown.init(elems, options);
							});
						*/
						).add('UIBinaryPicker',
						{
							header: 'Arm',
							option1: 'Left',
							option2: 'Right',
							headerSize: 'Font_H2',
							optionSize: 'Font_H4'
						}
						).add('UIMultiPicker',
						{
							header: 'Axis',
							options: 
							[
								'X',
								'Y',
								'X > Y',
								'Y > X',
								'X + Y'
							],
							headerSize: 'Font_H2',
							optionSize: 'Font_H4'
						}
						).add('UISubmitButton'
						),
				];
			case 'M.Information_P.Info':
				return [
					new UIContent('M.Information_P.Info_C.Network', panel
						).add('UISpacer', 		10
						).add('UIListItem',
						{
							sourceType: 'Dynamic',
							source: 	'RQ.Network.SSID',
							size: 		'H1'
						}
						).add('UISeparator', 	'height'
						).add('UIListItem',
						{
							sourceType: 'Dynamic',
							source: 	'RQ.Network.IP',
							size: 		'H3'
						}
						).add('UIListItem',
						{
							sourceType: 'Dynamic',
							source: 	'RQ.Network.Protocol',
							size: 		'H4'
						}
						).add('UISpacer', 		20
						).add('UIStrength',
						{
							source: 	'RQ.Network.Signal',
							segments: 	6
						}
						).add('UISeparator', 	'Top'
						).add('UIListItem',
						{
							sourceType: 'Static',
							source: 	'Mode',
							size: 		'H1'
						}
						).add('UIListItem',
						{
							sourceType: 'Dynamic',
							source: 	'RQ.Network.Mode',
							size: 		'H4'
						}
						).add('UISeparator', 	'height'),

					new UIContent('M.Information_P.Info_C.System', panel
						).add('UIListItem',
						{
							sourceType: 'Dynamic',
							source: 	'RQ.System.Version',
							size: 		'H1'
						}
						).add('UISeparator', 	'height'
						).add('UIListItem',
						{
							sourceType: 'Static',
							source: 	'Print Area',
							size: 		'H2'
						}
						).add('UIListItem',
						{
							sourceType: 'Dynamic',
							source: 	'RQ.System.PrintArea',
							size: 		'H4'
						}
						).add('UISeparator', 	'Top'
						).add('UIListItem',
						{
							sourceType: 'Static',
							source: 	'Speed',
							size: 		'H1'
						}
						).add('UIListItemMatrix',
						[
							[
								{
									sourceType: 'Static',
									source: 	'Draw',
									size: 		'H3'
								},{
									sourceType: 'Dynamic',
									source: 	'RQ.System.DrawSpeed',
									size: 		'H4'
								}
							],
							[
								{
									sourceType: 'Static',
									source: 	'Travel',
									size: 		'H3'
								},{
									sourceType: 'Dynamic',
									source: 	'RQ.System.TravelSpeed',
									size: 		'H4'
								}
							]
						]
						).add('UISeparator', 	'height'),

					new UIContent('M.Information_P.Info_C.Storage', panel
						).add('UIListItem',
						{
							sourceType: 'Dynamic',
							source: 	'RQ.Storage.Label',
							size: 		'H1'
						}
						).add('UISeparator', 	'height'
						).add('UISpacer', 		15
						).add('UIListItem',
						{
							sourceType: 'Static',
							source: 	'Files',
							size: 		'H2'
						}
						).add('UIListItem',
						{
							sourceType: 'Dynamic',
							source: 	'RQ.Storage.FileCount',
							size: 		'H4'
						}
						).add('UISpacer', 		15
						).add('UISeparator', 	'Top'
						).add('UIListItem',
						{
							sourceType: 'Static',
							source: 	'Free Space',
							size: 		'H1'
						}
						).add('UIListItem',
						{
							sourceType: 'Dynamic',
							source: 	'RQ.Storage.FreeSpace',
							size: 		'H4'
						}
						).add('UISeparator', 	'height')
				];
			case 'M.FileManager_P.FileManager':
				return [
					new UIContent('M.FileManager_P.FileManager_C.FileManager', panel
						).add('UIContainer',
						{
							source: 'RQ.Collection.FileList',
							systemLink: 'S.System_CMD.GetSharedSystemFunctions',
							previewLink: 'M.FileManager_P.Preview_C.Preview',
							previewType: UISVGPreview,
							width: 560,
							height: 500,
							xOffset: 60,
							itemWidth: 116,
							itemHeight: 116,
							horizontalSpacing: 	20,
							verticalSpacing: 	0
						}
						).addLinkReq('M.FileManager_P.Preview_C.Preview'
						).addLinkReq('S.System_CMD.GetSharedSystemFunctions'
						)
				];
			case 'M.FileManager_P.Preview':
				return [
					new UIContent('M.FileManager_P.Preview_C.Preview', panel
						).add('UISVGPreview',
						{
							previewWidth: 300,
							previewHeight: 200
						}
						)
				];
			case 'M.LoadIMG_P.Preview':
				return [
					new UIContent('M.LoadIMG_P.Preview_C.Preview', panel
						).add('UICanvas',
						{
							width: 500,
							height: 450
						}
						).add('UISpacer', 5
						).add('UILightButton',
						{
							systemLink: 'S.System_CMD.GetSharedSystemFunctions',
							cmd: 'M.LoadIMG_P.Preview_C.Preview_CMD.StartProcessing',
							label: 'Process Image',
							icon: 'play'
						}
						).addLinkReq('S.System_CMD.GetSharedSystemFunctions'
						)
				];
			case 'M.LoadIMG_P.Gaussian':
				return [
					new UIContent('M.LoadIMG_P.Gaussian_C.Gaussian', panel
						).add('UIListItem',
						{
							sourceType: 'Static',
							source: 	'Gaussian Blur',
							size: 		'H3'
						}
						).add('UISpacer', 20
						).add('UISlidePicker',
						{
							label: 'Kernel Size',
							labelSize: 'Font_H5',
							noUiSliderData: {
								range: {
									'min': 3,
									'max': 21
								},
								start: [3],
								step: 2,
								tooltips: wNumb({ decimals: 0 }),
								behaviour: 'snap'
							}
						}
						).add('UISlidePicker',
						{
							label: 'Sigma',
							labelSize: 'Font_H5',
							noUiSliderData: {
								range: {
									'min': 1,
									'max': 10
								},
								start: [1.5],
								step: 0.1,
								tooltips: wNumb({ decimals: 1 }),
								behaviour: 'snap'
							}
						}
						)
				];
			case 'M.LoadIMG_P.Canny':
				return [
					new UIContent('M.LoadIMG_P.Canny_C.Canny', panel
						).add('UIListItem',
						{
							sourceType: 'Static',
							source: 	'Canny Edge Detection',
							size: 		'H3'
						}
						).add('UISpacer', 10
						).add('UIMultiPicker',
						{
							header: null,
							options: 
							[
								'Sobel',
								'Roberts',
								'Prewitt'
							],
							optionSize: 'Font_H4'
						}
						).add('UISpacer', 5
						).add('UISlidePicker',
						{
							label: 'Hysteresis',
							labelSize: 'Font_H5',
							noUiSliderData: {
								range: {
									'min': 1,
									'max': 255
								},
								start: [ 50, 100 ],
								connect: true,
								step: 1,
								margin: 1,
								tooltips: [ wNumb({ decimals: 0 }), wNumb({ decimals: 0 }) ],
								behaviour: 'tap-drag'
							}
						}
						)
				];
			case 'M.LoadIMG_P.Filters':
				return [
					new UIContent('M.LoadIMG_P.Filters_C.Filters', panel
						).add('UIListItem',
						{
							sourceType: 'Static',
							source: 	'Filters',
							size: 		'H3'
						}
						).add('UISpacer', 20
						).add('UIToggle',
						{
							label: 'Invert',
							labelSize: 'Font_H4',
							onByDefault: true
						}
						)
				]; 
		}
	}
};