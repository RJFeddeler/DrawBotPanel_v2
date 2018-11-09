var IMG = {
	loadAndCopyResized(fileName, newCanvas) {
		return new Promise((resolve, reject) => {
			LocalFile.loadImage(fileName).then(img => {
				let w = img.width;
                let h = img.height;

                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");

                canvas.width  = w;
                canvas.height = h;

                ctx.drawImage(img, 0, 0);
                
                let imgData = ctx.getImageData(0, 0, w, h);

                if (w <= 0 || h <= 0)
                	reject(Error('Width or Height Equal to Zero!'));

                let arImg = w / h;

                if (arImg > 1.6)
                	newCanvas.width *= 1.2;
                else if (arImg > 1.3)
                	newCanvas.width *= 1.1;

                let arCanvas = newCanvas.width / newCanvas.height;

                if (arImg > arCanvas)
                	newCanvas.height *= arCanvas / arImg;
                else if (arCanvas > arImg)
                	newCanvas.width *= arImg / arCanvas;


				this.hermiteDownsample(newCanvas, imgData, newCanvas.width, newCanvas.height);

				resolve(imgData);
			}).catch(error => {
				reject(Error(error));
			});
		});
	},

	hermiteDownsample(canvasDest, imageSrc, width, height) {
		var width_source = parseInt(imageSrc.width);
		var height_source = parseInt(imageSrc.height);

		width = Math.round(width);
		height = Math.round(height);

		var ratio_w = width_source / width;
		var ratio_h = height_source / height;
		var ratio_w_half = Math.ceil(ratio_w / 2);
		var ratio_h_half = Math.ceil(ratio_h / 2);

		var ctxDest = canvasDest.getContext("2d");
		var imgDest = ctxDest.createImageData(width, height);

		var dataSrc  = imageSrc.data;
		var dataDest = imgDest.data;

		for (var j = 0; j < height; j++) {
			for (var i = 0; i < width; i++) {
				var x2 = (i + j * width) * 4;
				var weight = 0;
				var weights = 0;
				var weights_alpha = 0;
				var gx_r = 0;
				var gx_g = 0;
				var gx_b = 0;
				var gx_a = 0;
				var center_y = (j + 0.5) * ratio_h;
				var yy_start = Math.floor(j * ratio_h);
				var yy_stop = Math.ceil((j + 1) * ratio_h);
				for (var yy = yy_start; yy < yy_stop; yy++) {
					var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
					var center_x = (i + 0.5) * ratio_w;
					var w0 = dy * dy; //pre-calc part of w
					var xx_start = Math.floor(i * ratio_w);
					var xx_stop = Math.ceil((i + 1) * ratio_w);
					for (var xx = xx_start; xx < xx_stop; xx++) {
						var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
						var w = Math.sqrt(w0 + dx * dx);
						if (w >= 1) {
							//pixel too far
							continue;
						}
						//hermite filter
						weight = 2 * w * w * w - 3 * w * w + 1;
						var pos_x = 4 * (xx + yy * width_source);
						//alpha
						gx_a += weight * dataSrc[pos_x + 3];
						weights_alpha += weight;
						//colors
						if (dataSrc[pos_x + 3] < 255)
							weight = weight * dataSrc[pos_x + 3] / 250;
						gx_r += weight * dataSrc[pos_x];
						gx_g += weight * dataSrc[pos_x + 1];
						gx_b += weight * dataSrc[pos_x + 2];
						weights += weight;
					}
				}
				dataDest[x2] = gx_r / weights;
				dataDest[x2 + 1] = gx_g / weights;
				dataDest[x2 + 2] = gx_b / weights;
				dataDest[x2 + 3] = gx_a / weights_alpha;
			}
		}
		
		ctxDest.putImageData(imgDest, 0, 0);
	}
}