var RQGet = {
	setState: function(state) {
		this.RQState = state;
	},
	
	value: function(name) {
		if (!this.RQState)
			return;

		switch (name) {
			case 'RQ.System.Version':
				return 'DrawBot v' + this.RQState.System_Version;
			case 'RQ.System.PrintArea':
				return this.RQState.System_PrintAreaWidth + 'mm x ' + this.RQState.System_PrintAreaHeight + 'mm';
			case 'RQ.System.DrawSpeed':
				return this.RQState.System_DrawSpeed + 'mm/s';
			case 'RQ.System.TravelSpeed':
				return this.RQState.System_TravelSpeed + 'mm/s';
			case 'RQ.Network.SSID':
				return this.RQState.Network_SSID;
			case 'RQ.Network.IP':
				return this.RQState.Network_IP;
			case 'RQ.Network.Protocol':
				return this.RQState.Network_Protocol;
			case 'RQ.Network.Signal':
				return this.RQState.Network_Signal;
			case 'RQ.Network.Mode':
				return NetworkModeEnum.properties[this.RQState.Network_Mode].display;
			case 'RQ.Storage.Label':
				return this.RQState.Storage_Label;
			case 'RQ.Storage.FileCount':
				return this.RQState.Storage_FileCount;
			case 'RQ.Storage.FreeSpace':
				return this.RQState.Storage_FreeSpace + 'MB of ' + this.RQState.Storage_Capacity + 'MB';
			/*
			case '':
				return;
			case '':
				return;
			case '':
				return;
			case '':
				return;
			case '':
				return;
			case '':
				return;
			case '':
				return;
			case '':
				return; */
		}
	},

	collection: function(name) {
		if (!this.RQState)
			return;
		
		switch (name) {
			case 'RQ.Collection.FileList':
				return 'File List Here';
		}
	}
}