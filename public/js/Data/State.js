var DrawBotState = {
	System_State:0,
	System_Version: '',

	System_DrawSpeed:0,
	System_TravelSpeed:0,
	System_PrintAreaWidth:0,
	System_PrintAreaHeight:0,

	Storage_Type:0,
	Storage_Label:'',
	Storage_FileCount:0,
	Storage_Capacity:0,
	Storage_FreeSpace:0,

	Network_State:0,
	Network_Mode:0,
	Network_Protocol:'',
	Network_SSID:'',
	Network_Signal:0,
	Network_Security:0,
	Network_IP:'',
	Network_DHCP:0,
	Network_Netmask:'',
	Network_Gateway:'',

	ArmSpec_Left_Stepper1_Range:0,
	ArmSpec_Left_Stepper1_StepsPerRev:0,
	ArmSpec_Left_Stepper1_Microstep:0,

	ArmSpec_Left_Stepper2_Range:0,
	ArmSpec_Left_Stepper2_StepsPerRev:0,
	ArmSpec_Left_Stepper2_Microstep:0,

	ArmSpec_Left_Servo_Range:0,
	ArmSpec_Left_Servo_Down:0,
	ArmSpec_Left_Servo_Up:0,

	ArmSpec_Right_Stepper1_Range:0,
	ArmSpec_Right_Stepper1_StepsPerRev:0,
	ArmSpec_Right_Stepper1_Microstep:0,

	ArmSpec_Right_Stepper2_Range:0,
	ArmSpec_Right_Stepper2_StepsPerRev:0,
	ArmSpec_Right_Stepper2_Microstep:0,

	ArmSpec_Right_Servo_Range:0,
	ArmSpec_Right_Servo_Down:0,
	ArmSpec_Right_Servo_Up:0,

	ArmPosition_Left_X: 0,
	ArmPosition_Left_Y: 0,
	ArmPosition_Left_Pen: 0,
	ArmPosition_Left_LinesDrawn: 0,

	ArmPosition_Right_X: 0,
	ArmPosition_Right_Y: 0,
	ArmPosition_Right_Pen: 0,
	ArmPosition_Right_LinesDrawn: 0,

	Time_Elapsed:0,

	PrintPreview_Filename:'',
	PrintPreview_ScaleX:100,
	PrintPreview_ScaleY:100,
	PrintPreview_OffsetX:0,
	PrintPreview_OffsetY:0,

	update: function(changes) {
		Object.assign(this, changes);
	}
};

var SystemStateEnum = {
	OFFLINE: 	1,
	ONLINE: 	2,
	ERROR: 		3,
	properties: {
		1: {
			name: 'offline',
			value: 1,
			display: 'Offline',
			color: '#ff9933'			},
		2: {
			name: 'online',
			value: 2,
			display: 'Online',
			color: '#00bb00' 			},
		3: {
			name: 'error',
			value: 3,
			display: 'ERROR!',
			color: '#ff0000' 			}
	}
};

var StorageTypeEnum = {
	NONE: 		1,
	MMC: 		2,
	SD: 		3,
	SDHC: 		4,
	UNKNOWN: 	5,
	properties: {
		1: {
			name: 'none',
			value: 1,
			display: 'None'				},
		2: {
			name: 'mmc',
			value: 2,
			display: 'MMC'				},
		3: {
			name: 'sd',
			value: 3,
			display: 'SD'				},
		4: {
			name: 'sdhc',
			value: 4,
			display: 'SDHC'				},
		5: {
			name: 'unknown',
			value: 5,
			display: 'Unknown'			}
	}
};

var NetworkStateEnum = {
	OFFLINE: 	1,
	CONNECTING: 2,
	ONLINE: 	3,
	ERROR: 		4,
	properties: {
		1: {
			name: 'offline',
			value: 1,
			display: 'Offline',
			color: '#c0c0c0'			},
		2: {
			name: 'connecting',
			value: 2,
			display: 'Connecting...',
			color: '#ff9933'			},
		3: {
			name: 'online',
			value: 3,
			display: 'Online',
			color: '#00bb00'			},
		4: {
			name: 'error',
			value: 4,
			display: 'ERROR!',
			color: '#ff0000'			}
	}
};

var NetworkModeEnum = {
	AP: 		1,
	STA: 		2,
	properties: {
		1: {
			name: 'accesspoint',
			value: 1,
			display: 'Access Point'		},
		2: {
			name: 'station',
			value: 2,
			display: 'Station'			}
	}
};

var NetworkSecurityEnum = {
	OPEN: 		1,
	WEP: 		2,
	WPA: 		3,
	WPA2: 		4,
	WPA_WPA2: 	5,
	properties: {
		1: {
			name: 'open',
			value: 1,
			display: 'Open'				},
		2: {
			name: 'wep',
			value: 2,
			display: 'WEP'				},
		3: {
			name: 'wpa',
			value: 3,
			display: 'WPA'				},
		4: {
			name: 'wpa2',
			value: 4,
			display: 'WPA2'				},
		5: {
			name: 'wpa_wpa2',
			value: 5,
			display: 'WPA_WPA2'			}
	}
};

var BooleanEnum = {
	TRUE: 		1,
	FALSE: 		2,
	properties: {
		1: {
			name: 'true',
			value: 1,
			display: 'True',
			color: '#00bb00',
			display_alt1: 'Enabled',
			display_alt2: 'On'			},
		2: {
			name: 'false',
			value: 2,
			display: 'False',
			color: '#cc0000',
			display_alt1: 'Disabled',
			display_alt2: 'Off'			}
	}
};

var PenPositionEnum = {
	UP: 		1,
	DOWN: 		2,
	properties: {
		1: {
			name: 'up',
			value: 1,
			display: 'Up',
			color: '#cc0000',
			display_alt1: 'Not Drawing',
			display_alt2: 'Traveling'	},
		2: {
			name: 'down',
			value: 2,
			display: 'Down',
			color: '#00bb00',
			display_alt1: 'Drawing',
			display_alt2: 'Drawing'		}
	}
};