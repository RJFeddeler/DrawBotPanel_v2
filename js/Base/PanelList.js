'use strict';

class PanelList {
    constructor() {}

    static get(panel, topOffset, bottomOffset) {
    	let id = 0;
    	switch(panel.name()) {
    		case 'M.Overview_P.Info':
    			return [
	    			new UIContent('M.Overview_P.Info_C.Network', id++, panel.shape(), topOffset, bottomOffset
	    				).add('UISpacer', 		10
		        		).add('UIListItem',
		        		{
		        			sourceType: 'Dynamic',
		        			source: 	'RQ.Network.SSID',
		        			size: 		'H1'
		        		}
		        		).add('UISeparator', 	'Bottom'
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
		        		).add('UISeparator', 	'Bottom'),

		        	new UIContent('M.Overview_P.Info_C.System', id++, panel.shape(), topOffset, bottomOffset
	    				).add('UIListItem',
		        		{
		        			sourceType: 'Dynamic',
		        			source: 	'RQ.System.Version',
		        			size: 		'H1'
		        		}
		        		).add('UISeparator', 	'Bottom'
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
		            	).add('UISplit',
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
		            	).add('UISeparator', 	'Bottom'),

		            new UIContent('M.Overview_P.Info_C.Storage', id++, panel.shape(), topOffset, bottomOffset
	    				).add('UIListItem',
			            {
			            	sourceType: 'Dynamic',
			            	source: 	'RQ.Storage.Label',
			            	size: 		'H1'
			            }
			            ).add('UISeparator', 	'Bottom'
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
			            ).add('UISeparator', 	'Bottom')
		        ];
    		case 'M.Files_P.FileManager':
    			return [
    				new UIContent('M.Files_P.FileManager_C.FileManager', id++, panel.shape(), topOffset, bottomOffset
	    				).add('UISpacer', 		20
    					).add('UIWell',
    					{
    						name: 		'FileList',
    						source: 	'RQ.Collection.FileList',
    						height: 	400
    					}
    					).add('UISpacer', 		90)
    			];
    	}

    }
}