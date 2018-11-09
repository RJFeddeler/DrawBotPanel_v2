'use strict';

class ShapeSelector {
	static horizontal(width, height, lineOffset) {
		var list = [];

		if (!(lineOffset < height))
			return [];

		for (var x = 0; x < width; x++)
			list.push(lineOffset * width + x);

		return list;
	}

	static vertical(width, height, lineOffset) {
		var list = [];

		if (!(lineOffset < width))
			return [];

		for (var y = 0; y < height; y++)
			list.push(y * width + lineOffset);

		return list;
	}

	static forwardDiagonal(width, height, lineOffset) {
		var list = [];

		if (!(lineOffset < width + height - 1))
			return [];

		var x = lineOffset;
		var y = 0;

		if (x >= width) {
			y = x - width + 1;
			x = width - 1;
		}

		while (x >= 0 && y < height)
			list.push(y++ * width + x--);

		return list;
	}

	static backwardDiagonal(width, height, lineOffset) {
		var list = [];

		if (!(lineOffset < width + height - 1))
			return [];

		var x = lineOffset;
		var y = height - 1;

		if (x >= width) {
			y = height - (x - width) - 2;
			x = width - 1;
		}

		while (x >= 0 && y >= 0)
			list.push(y-- * width + x--);

		return list;
	}
}
