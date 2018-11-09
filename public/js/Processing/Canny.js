var Canny = {

	canvasToGrayscale(canvas) {
		var ctx 	= canvas.getContext('2d');
		var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		return this.imageDataToGrayscale(imgData);
	},

	imageDataToGrayscale(imgData) {
		var r, g, b;

		var imgGS = this.generateMatrix(imgData.width, imgData.height, 0);

		let x = 0;
		let y = 0;
		
		for (let i = 0; i < imgData.data.length; i += 4) {
			r = imgData.data[i];
			g = imgData.data[i + 1];
			b = imgData.data[i + 2];

			imgGS[x][y] = Math.round(0.298 * r + 0.586 * g + 0.114 * b);
			
			if (x === imgData.width - 1) {
				x = 0;
				y++;
			}
			else
				x++;
		}

		return { width: imgData.width, height: imgData.height, data: imgGS };
	},

	grayscaleToImageData(img) {
		var offset;

		var imgData = new ImageData(img.width, img.height);

		for (let y = 0; y < img.height; y++) {
			for (let x = 0; x < img.width; x++) {
				offset = (y * img.width + x) * 4;

				imgData.data[offset] 	 = img.data[x][y];
				imgData.data[offset + 1] = img.data[x][y];
				imgData.data[offset + 2] = img.data[x][y];
				imgData.data[offset + 3] = 255;
			}
		}

		return imgData;
	},

	generateMatrix(width, height, initialValue = 0) {
		var matrix = [];

		for (let x = 0; x < width; x++) {
			matrix[x] = [];

			for (let y = 0; y < height; y++)
				matrix[x][y] = initialValue;
		}

		return matrix;
	},

	generateGaussianKernel(sigma, size) {
		if (size % 2 != 1)
			size--;

		const s = 2.0 * sigma * sigma;
		const radius = (size - 1) / 2;

		var kernel = this.generateMatrix(size, size, 0);
		var r, sum = 0.0;

		for (let x = -radius; x <= radius; x++) {
			for (let y = -radius; y <= radius; y++) {
				r = Math.sqrt(x*x + y*y);
				kernel[x + radius][y + radius] = (Math.exp(-(r*r)/s))/(Math.PI * s);
				sum += kernel[x + radius][y + radius];
			}
		}

		for (let x = 0; x < size; x++)
			for (let y = 0; y < size; y++)
				kernel[x][y] /= sum;

		return kernel;
	},

	convolve(img, kernel, kernelSize) {
		if (kernelSize % 2 != 1)
			return img;

		var sum, n, _nx, _ny;

		const center = (kernelSize - 1) / 2;
		const factor = kernelSize * kernelSize;

		var result = { width: img.width, height: img.height, data: this.generateMatrix( img.width, img.height, 0 ) };
		
		for (let x = 0; x < img.width; x++) {
			for (let y = 0; y < img.height; y++) {
				sum = 0;

				for (let i = 0; i < kernelSize; i++) {
					for (let j = 0; j < kernelSize; j++) {
						_nx = x + (i - center);
						_ny = y + (j - center);

						_nx = _nx <= 0 ? 0 : (_nx < img.width ? _nx : (img.width - 1));
						_ny = _ny <= 0 ? 0 : (_ny < img.height ? _ny : (img.height - 1));
						
						sum += img.data[_nx][_ny] * kernel[i][j];
					}
				}

				result.data[x][y] = sum;
			}
		}

		return result;
	},

	gaussianBlur(img, sigma, size) {
		return this.convolve( img, this.generateGaussianKernel(sigma, size), size );
	},

	sobel(img) {
		const gx = [ [-1, -2, -1], [0, 0, 0], [1, 2, 1] ];
		const gy = [ [1, 0, -1], [2, 0, -2], [1, 0, -1] ];
		
		var copyX = this.convolve(img, gx, 3);
		var copyY = this.convolve(img, gy, 3);

		var copy = this.generateMatrix(img.width, img.height, 0);

		for (let x = 0; x < img.width; x++)
			for (let y = 0; y < img.height; y++)
				copy[x][y] = Math.sqrt(copyX.data[x][y] * copyX.data[x][y] + copyY.data[x][y] * copyY.data[x][y]);

		return { width: img.width, height: img.height, data: copy };
	},

	roberts(img) {
		const gx = [ [0, -1], [1, 0] ];
		const gy = [ [-1, 0], [0, 1] ];
		
		var copyX = this.convolve(img, gx, 2);
		var copyY = this.convolve(img, gy, 2);

		var copy = this.generateMatrix(img.width, img.height, 0);

		for (let x = 0; x < img.width; x++)
			for (let y = 0; y < img.height; y++)
				copy[x][y] = Math.sqrt(copyX.data[x][y] * copyX.data[x][y] + copyY.data[x][y] * copyY.data[x][y]);

		return { width: img.width, height: img.height, data: copy };
	},

	prewitt(img) {
		const gx = [[-1, -1, -1], [0, 0, 0], [1, 1, 1]];
		const gy = [[1, 0, -1], [1, 0, -1], [1, 0, -1]];
		
		var copyX = this.convolve(img, gx, 3);
		var copyY = this.convolve(img, gy, 3);

		var copy = this.generateMatrix(img.width, img.height, 0);

		for (let x = 0; x < img.width; x++)
			for (let y = 0; y < img.height; y++)
				copy[x][y] = Math.sqrt(copyX.data[x][y] * copyX.data[x][y] + copyY.data[x][y] * copyY.data[x][y]);

		return { width: img.width, height: img.height, data: copy };
	},

	nonMaximumSuppression(img) {
		var nx = [ 0, 0 ],
			ny = [ 0, 0 ];

		var copy = this.generateMatrix(img.width, img.height, 0);

		for (let x = 0; x < img.width; x++) {
			for (let y = 0; y < img.height; y++) {
				nx[0] = ((x - 1) <= 0 ? 0 : (x - 1));
				nx[1] = ((x + 1) >= img.width ? (img.width - 1) : (x + 1));
				ny[0] = ((y - 1) <= 0 ? 0 : (y - 1));
				ny[1] = ((y + 1) >= img.height ? (img.height - 1) : (y + 1));

				if (img.data[x][y] > img.data[nx[0]][y] && img.data[x][y] > img.data[nx[1]][y])
					copy[x][y] = img.data[x][y];
				else
					copy[x][y] = 0;

				if (img.data[x][y] > img.data[nx[0]][ny[1]] && img.data[x][y] > img.data[nx[1]][ny[0]])
					copy[x][y] = img.data[x][y];
				else
					copy[x][y] = 0;

				if (img.data[x][y] > img.data[x][ny[0]] && img.data[x][y] > img.data[x][ny[1]])
					copy[x][y] = img.data[x][y];
				else
					copy[x][y] = 0;

				if (img.data[x][y] > img.data[nx[0]][ny[0]] && img.data[x][y] > img.data[nx[1]][ny[1]])
					copy[x][y] = img.data[x][y];
				else
					copy[x][y] = 0;
			}
		}

		return { width: img.width, height: img.height, data: copy };
	},

	hysteresis(img, ht, lt) {
		var copy = this.generateMatrix(img.width, img.height, 0);

		for (let x = 0; x < img.width; x++)
			for (let y = 0; y < img.height; y++)
				if (img.data[x][y] >= ht)
					copy[x][y] = 255;
				else
					copy[x][y] = img.data[x][y];

		traverseEdge = function(x, y) {
			if (x === 0 || y === 0 || x === img.width - 1 || y === img.height - 1)
				return;

			if (copy[x][y] >= ht) {
				var results = [];
				var n;

				for (let i = 0; i < 3; i++) {
					var subResults = [];

					results.push((function() {
						for (let j = 0; j < 3; j++) {
							n = copy[x - 1 + i][y - 1 + j];
							
							if (n < ht && n >= lt) {
								copy[x - 1 + i][y - 1 + j] = 255;
								subResults.push(traverseEdge(x - 1 + i, y - 1 + j));
							}
							else
								subResults.push(void 0);
						}

						return subResults;
					})());
				}

				return results;
			}
		};

		for (let x = 0; x < img.width; x++)
			for (let y = 0; y < img.height; y++)
				traverseEdge(x, y);

		for (let x = 0; x < img.width; x++)
			for (let y = 0; y < img.height; y++)
				if (copy[x][y] < ht)
					copy[x][y] = 0;

		return { width: img.width, height: img.height, data: copy };
	},

	invert(img) {
		var data = this.generateMatrix(img.width, img.height, 0);

		for (let x = 0; x < img.width; x++)
			for (let y = 0; y < img.height; y++)
				data[x][y] = 255 - img.data[x][y];

		return { width: img.width, height: img.height, data: data };
	},

	process(imgData, blurKernel, blurSigma, cannyAlgo, cannyHystLow, cannyHystHigh, invert) {
		blurKernel 		= 5; //blurKernel 	|| 5;
		blurSigma 		= 1.0; //blurSigma 	|| 1.4;

		cannyAlgo 		= 'Sobel'; //cannyAlgo 	|| 'Sobel';
		cannyHystLow 	= 10; //cannyHystLow 	|| 50;
		cannyHystHigh 	= 150; //cannyHystHigh || 100;


		var result = this.imageDataToGrayscale(imgData);
		
		result = this.gaussianBlur(result, blurSigma, blurKernel);

		if (cannyAlgo == 'Roberts')
			result = this.roberts(result);
		else if (cannyAlgo == 'Prewitt')
			result = this.prewitt(result);
		else
			result = this.sobel(result);

		result = this.nonMaximumSuppression(result);
		result = this.hysteresis(result, cannyHystHigh, cannyHystLow);

		if (invert)
			result = this.invert(result);

		return this.grayscaleToImageData(result);
	}
}