'use strict';

class UISVGPreview {
	constructor(previewWidth, previewHeight) {
		this._width  = previewWidth;
		this._height = previewHeight;

		this._file = null;

		this._svgElement 	= new UIElement( 'div', 'UISVGPreview_SVG'
			).setStyle( 'width',  this._width
			).setStyle( 'height', this._height
		);

		this._headerElement = new UIElement( 'div', 'UISVGPreview_Header' );

		this._infoElement 	= new UIElement( 'div', 'UISVGPreview_Info' );

		this._timeElement 	= new UIElement( 'div', 'UISVGPreview_Time' );

		this._startElement 	= new UIElement( 'div', 'UISVGPreview_Start' );

		this.element 		= new UIElement( 'div', 'UISVGPreview'
			).append( this._svgElement.domElement()
			).append( this._headerElement.domElement()
			).append( this._infoElement.domElement()
			).append( this._timeElement.domElement()
			).append( this._startElement.domElement()
		);

		this.state = readyState.WAITINGFORDATA;

		return this;
	}

	handleMessage(msg, value) {
		switch (msg) {
			case 'Update':

				let name = this._file.title();

				this._headerElement.html( name );

				this._infoElement.html(
					'<ul><li>Date:</li><li>Size:</li></ul>' + 

					'<ul><li>'   + this._file.date() + 
					'</li><li>'  + this._file.size() + 
					'</li></ul>' +

					'<ul><li>Count:</li><li>Length:</li></ul>' + 

					'<ul><li>'  + this._file.lineCount() + 
					'</li><li>' + this._file.lineLength() + 
					'</li></ul>'
				);

				let s = this._file.estimateTime();
				let h = Math.trunc(s / 3600);
				s %= 3600;
				let m = Math.trunc(s / 60);
				s %= 60;

				this._timeElement.html(
					(h > 0 ? h + ' Hours ' : '') + m + ' Minutes'
				);

				this._startElement.html('<a><i class="fas fa-play"></i></a>'
					).addListener('click', function() { this._file.container().itemDraw(this._file.id()); }.bind(this)
					);

				this._svgElement.append( this._file.svg() );

				break;

			case 'Shown':

				break;
		}
	}

	update() {
	}

	show(file) {
		if ( this._file ) {
			SVG.erasePathAnimation( this._file.svg() );
			setTimeout( function() { this._svgElement.clear(); this._file = null; this.show(file); }.bind(this), 1000 );
		}
		else {
			this._file = file;
			this.handleMessage( 'Update', null );
			SVG.playPathAnimation( this._file.svg() );
		}
	}

	state() 		{ return this.state; 				}
	domElement() 	{ return this.element.domElement(); }
}