var SVG = {
	loadFromServer: (filename) => {
		return new Promise((resolve, reject) => {
			ServerFile.loadTextFileAsLines(filename).then(lines => {
				if (lines.length > 0)
					resolve(lines);
				else
					reject(Error('Error reading SVG:  No lines found'));
			})
			.catch(error => {
				console.log(error);
			});
		});
	},

	loadFromLocal: (file) => {
		return new Promise((resolve, reject) => {
			LocalFile.loadTextFile(file).then(svgStr => {
				var parser = new DOMParser();
				var doc = parser.parseFromString(svgStr, "image/svg+xml");
				var svg = doc.querySelectorAll('svg');

				if (svg.length == 1)
					resolve({ name: file.name, image: svg[0] });
				else
					reject(Error('Error parsing SVG string.'));
			})
			.catch(error => {
				reject(Error(error));
			});
		});
	},

	parseNode: (doc) => {
		var docTag = SVG.parseTag(doc.tagName);

		if (!docTag)
			return null;

		var node = { tag: docTag, attributes: {} };

		for (let i = 0; i < doc.attributes.length; i++)
			Object.assign(node.attributes, SVG.parseAttribute(doc.attributes[i]));

		if (doc.childElementCount > 0) {
			var c;
			node.children = [];

			for (let i = 0; i < doc.childElementCount; i++)
				if (c = SVG.parseNode(doc.children[i]))
					node.children.push(c);
		}

		return node;
	},

	parseTag: (tag) => {
		var tagName = tag.trim().toUpperCase();

		switch (tagName) {
			case 'SVG':
			case 'G':
			case 'LINE':
			case 'RECT':
			case 'CIRCLE':
			case 'ELLIPSE':
			case 'POLYGON':
			case 'POLYLINE':
			case 'PATH':
			case 'MESH':
				return tagName;
			default:
				return null;
		}
	},

	parseAttribute: (attribute) => {
		switch (attribute.name.toUpperCase().trim()) {
			case 'STYLE':
				return { STYLE: attribute.value };

			case 'VIEWBOX':
				return { VIEWBOX: attribute.value.split(/[\n\s,]+/g).map(Number) };

			case 'TRANSFORM':
				var newTransform = [ 1, 0, 0, 1, 0, 0 ];
				var tmp1 = attribute.value.split(')');

				for (var j = 0; j < tmp1.length - 1; j++) {
					var tmp2 = tmp1[j].split('(');
					var params = tmp2[1].split(/[\s,]+/g);

					switch (tmp2[0].toUpperCase().trim()) {
						case 'MATRIX':
							if (SVG.numberifyParams(params, 6))
								break;

							newTransform = SVG.matrixMultiply(newTransform, params);

							break;

						case 'TRANSLATE':
							if (SVG.numberifyParams(params, 2)) {
								if (SVG.numberifyParams(params, 1))
									break;
								
								newTransform = SVG.matrixMultiply(newTransform, [ 1, 0, 0, 1, params[0], 0 ]);
							}
							else
								newTransform = SVG.matrixMultiply(newTransform, [ 1, 0, 0, 1, params[0], params[1] ]);

							break;

						case 'SCALE':
							if (SVG.numberifyParams(params, 2)) {
								if (SVG.numberifyParams(params, 1))
									break;
								
								newTransform = SVG.matrixMultiply(newTransform, [ params[0], 0, 0, params[0], 0, 0 ]);
							}
							else
								newTransform = SVG.matrixMultiply(newTransform, [ params[0], 0, 0, params[1], 0, 0 ]);

							break;

						case 'ROTATE':
							if (SVG.numberifyParams(params, 3)) {
								if (SVG.numberifyParams(params, 1))
									break;
								
								newTransform = SVG.matrixMultiply(newTransform, [ Math.cos(params[0]), Math.sin(params[0]), -Math.sin(params[0]), Math.cos(params[0]), 0, 0 ]);
							}
							else {
								newTransform = SVG.matrixMultiply(newTransform, [ 1, 0, 0, 1, params[1], params[2] ]);
								newTransform = SVG.matrixMultiply(newTransform, [ Math.cos(params[0]), Math.sin(params[0]), -Math.sin(params[0]), Math.cos(params[0]), 0, 0 ]);
								newTransform = SVG.matrixMultiply(newTransform, [ 1, 0, 0, 1, -params[1], -params[2] ]);
							}

							break;

						case 'SKEWX':
							if (SVG.numberifyParams(params, 1))
								break;

							newTransform = SVG.matrixMultiply(newTransform, [ 1, 0, Math.tan(params[0]), 1, 0, 0 ]);

							break;

						case 'SKEWY':
							if (SVG.numberifyParams(params, 1))
								break;

							newTransform = SVG.matrixMultiply(newTransform, [ 1, Math.tan(params[0]), 0, 1, 0, 0 ]);

							break;

						default:
							break;
					}
				}

				return { TRANSFORM: newTransform };

			case 'POINTS':
				while (attribute.value.endsWith(',') || attribute.value.endsWith(' ') || attribute.value.endsWith('\n'))
					attribute.value = attribute.value.slice(0, -1);

				var p = attribute.value.split(/[\n\s,]+/g).map(Number);
				
				return { POINTS: p };

			case 'D':
				while (attribute.value.endsWith(',') || attribute.value.endsWith(' ') || attribute.value.endsWith('\n'))
					attribute.value = attribute.value.slice(0, -1);

				var d = attribute.value.split(/[\n\s,]+/g);

				for (let i = 0; i < d.length; i++)
					if (isNaN(d[i]) && d[i].length > 1)
						d.splice(i, 1, d[i].charAt(0), Number(d[i].slice(1)));
					else if (!isNaN(d[i]))
						d[i] = Number(d[i]);
				
				return { D: d };

			case 'X':
				return { X: Number(attribute.value) };
			case 'Y':
				return { Y: Number(attribute.value) };
			case 'R':
				return { R: Number(attribute.value) };
			case 'RX':
				return { RX: Number(attribute.value) };
			case 'RY':
				return { RY: Number(attribute.value) };
			case 'CX':
				return { CX: Number(attribute.value) };
			case 'CY':
				return { CY: Number(attribute.value) };
			case 'X1':
				return { X1: Number(attribute.value) };
			case 'Y1':
				return { Y1: Number(attribute.value) };
			case 'X2':
				return { X2: Number(attribute.value) };
			case 'Y2':
				return { Y2: Number(attribute.value) };
			case 'WIDTH':
				return { WIDTH: Number(attribute.value) };
			case 'HEIGHT':
				return { HEIGHT: Number(attribute.value) };

		}

		return {};
	},

	numberifyParams: (params, count) => {
		if (params.length !== count)
			return -1;

		for (let i = 0; i < params.length; i++) {
			params[i] = Number(params[i].trim());
			if (isNaN(params[i]))
				return -1;
		}

		return 0;
	},

	matrixMultiply: (mA, mB) => {
		if (mA.length !== 6 || mB.length !== 6)
			return;

		var m = [];
		m.push(mB[0] * mA[0] + mB[1] * mA[2]);
		m.push(mB[0] * mA[1] + mB[1] * mA[3]);
		m.push(mB[2] * mA[0] + mB[3] * mA[2]);
		m.push(mB[2] * mA[1] + mB[3] * mA[3]);
		m.push(mB[4] * mA[0] + mB[5] * mA[2] + mA[4]);
		m.push(mB[4] * mA[1] + mB[5] * mA[3] + mA[5]);

		return m;
	},

	transformPoint: (point, matrix) => {
		var p = {};

		p.x = point.x * matrix[0] + point.y * matrix[2] + matrix[4];
		p.y = point.x * matrix[1] + point.y * matrix[3] + matrix[5];

		return p;
	},

	convertToROB: (parsed) => {
		return SVG.recursive_convertToROB(parsed).data;
	},

	recursive_convertToROB: (parsed, transform, location) => {
		if (parsed === null || typeof parsed !== 'object')
			return null;

		if (!parsed.hasOwnProperty('tag') || !parsed.hasOwnProperty('attributes'))
			return null;

		const arc_error = 0.0254;
		var segment_count, angle_step;
		var cur_point, cur_angle;

		transform = transform || [ 1, 0, 0, 1, 0, 0 ];
		location  = location  || { x: 0.0, y: 0.0 };

		var rob = [];

		// DONT FORGET VIEWBOX (and style?) !!!

		if (parsed.attributes.hasOwnProperty('TRANSFORM') && Array.isArray(parsed.attributes.TRANSFORM) && parsed.attributes.TRANSFORM.length === 6)
			transform = SVG.matrixMultiply(transform, parsed.attributes.TRANSFORM);

		switch (parsed.tag) {
			case 'SVG':
				if (parsed.attributes.hasOwnProperty('VIEWBOX')) {
					//let scale = Math.min(800 / parsed.attributes.VIEWBOX[2], 600 / parsed.attributes.VIEWBOX[3]);
					//transform = SVG.matrixMultiply(transform, [ scale, 0, 0, -scale, 0, scale * parsed.attributes.VIEWBOX[3] ]);
				}
			case 'G':
				if (!parsed.hasOwnProperty('children') || parsed.children.length < 1)
					return null;

				var child;
				for (let i = 0; i < parsed.children.length; i++) {
					child = SVG.recursive_convertToROB(parsed.children[i], transform, location);

					if (child) {
						if (child.hasOwnProperty('data') && Array.isArray(child.data)) {
							rob = rob.concat(child.data);
						}
						if (child.hasOwnProperty('location'))
							location = { x: child.location.x, y: child.location.y };
					}
				}

				break;

			case 'LINE':
				if (!parsed.attributes.hasOwnProperty('X1') || !parsed.attributes.hasOwnProperty('Y1') || !parsed.attributes.hasOwnProperty('X2') || !parsed.attributes.hasOwnProperty('Y2'))
					return null;

				location = SVG.transformPoint({ x: parsed.attributes.X2, y: parsed.attributes.Y2 }, transform);

				rob.push(SVG.transformPoint({ x: parsed.attributes.X1, y: parsed.attributes.Y1 }, transform));
				rob.push({ z: 1 });
				rob.push({ x: location.x, y: location.y });
				rob.push({ z: 0 });

				break;

			case 'RECT':
				if (!parsed.attributes.hasOwnProperty('X') || !parsed.attributes.hasOwnProperty('Y') || !parsed.attributes.hasOwnProperty('WIDTH') || !parsed.attributes.hasOwnProperty('HEIGHT'))
					return null;

				// ADD RX/RY ROUNDED EDGE SUPPORT
				segment_count = Math.PI / Math.acos((Math.max(parsed.attributes.RX, parsed.attributes.RY) - arc_error) / Math.max(parsed.attributes.RX, parsed.attributes.RY));
				angle_step = 360.0 / segment_count;
				segment_count /= 4.0;

				location = SVG.transformPoint({ x: parsed.attributes.X, y: parsed.attributes.Y }, transform);

				rob.push({ x: location.x, y: location.y });
				rob.push({ z: 1 });
				rob.push(SVG.transformPoint({ x: parsed.attributes.X + parsed.attributes.WIDTH, y: parsed.attributes.Y }, transform));
				rob.push(SVG.transformPoint({ x: parsed.attributes.X + parsed.attributes.WIDTH, y: parsed.attributes.Y + parsed.attributes.HEIGHT }, transform));
				rob.push(SVG.transformPoint({ x: parsed.attributes.X, y: parsed.attributes.Y + parsed.attributes.HEIGHT }, transform));
				rob.push({ x: location.x, y: location.y });
				rob.push({ z: 0 });

				break;

			case 'CIRCLE':
				if (!parsed.attributes.hasOwnProperty('CX') || !parsed.attributes.hasOwnProperty('CY') || !parsed.attributes.hasOwnProperty('R'))
					return null;

				segment_count = Math.PI / Math.acos((parsed.attributes.R - arc_error) / parsed.attributes.R);
				angle_step = 360.0 / segment_count;

				cur_point = SVG.point_on_circle(parsed.attributes.CX, parsed.attributes.CY, parsed.attributes.R, 0.0);
				cur_angle = angle_step;

				location = SVG.transformPoint({ x: cur_point.x, y: cur_point.y }, transform);

				rob.push({ x: location.x, y: location.y });
				rob.push({ z: 1 });

				for (let i = 1; i < segment_count; i++) {
					cur_point = SVG.point_on_circle(parsed.attributes.CX, parsed.attributes.CY, parsed.attributes.R, cur_angle);
					rob.push(SVG.transformPoint({ x: cur_point.x, y: cur_point.y }, transform));

					cur_angle += angle_step;
				}

				rob.push({ x: location.x, y: location.y });
				rob.push({ z: 0 });

				break;

			case 'ELLIPSE':
				if (!parsed.attributes.hasOwnProperty('CX') || !parsed.attributes.hasOwnProperty('CY') || !parsed.attributes.hasOwnProperty('RX') || !parsed.attributes.hasOwnProperty('RY'))
					return null;

				segment_count = Math.PI / Math.acos((Math.max(parsed.attributes.RX, parsed.attributes.RY) - arc_error) / Math.max(parsed.attributes.RX, parsed.attributes.RY));
				angle_step = 360.0 / segment_count;

				cur_point = SVG.point_on_ellipse(parsed.attributes.CX, parsed.attributes.CY, parsed.attributes.RX, parsed.attributes.RY, 0.0);
				cur_angle = angle_step;

				location = SVG.transformPoint({ x: cur_point.x, y: cur_point.y }, transform);

				rob.push({ x: location.x, y: location.y });
				rob.push({ z: 1 });

				for (let i = 1; i < segment_count; i++) {
					cur_point = SVG.point_on_ellipse(parsed.attributes.CX, parsed.attributes.CY, parsed.attributes.RX, parsed.attributes.RY, cur_angle);
					rob.push(SVG.transformPoint({ x: cur_point.x, y: cur_point.y }, transform));

					cur_angle += angle_step;
				}

				rob.push({ x: location.x, y: location.y });
				rob.push({ z: 0 });

				break;

			case 'POLYGON':
				if (!parsed.attributes.hasOwnProperty('POINTS'))
					return null;

				location = SVG.transformPoint({ x: parsed.attributes.POINTS[0], y: parsed.attributes.POINTS[1] }, transform);

				rob.push({ x: location.x, y: location.y });
				rob.push({ z: 1 });

				for (let i = 2; i < parsed.attributes.POINTS.length - 1; i += 2)
					rob.push(SVG.transformPoint({ x: parsed.attributes.POINTS[i], y: parsed.attributes.POINTS[i + 1]}, transform));

				rob.push({ x: location.x, y: location.y });
				rob.push({ z: 0 });

				break;

			case 'POLYLINE':
				if (!parsed.attributes.hasOwnProperty('POINTS'))
					return null;

				let pntCount = parsed.attributes.POINTS.length;
				if (pntCount % 2 === 0)
					location = SVG.transformPoint({ x: parsed.attributes.POINTS[pntCount - 2], y: parsed.attributes.POINTS[pntCount - 1] }, transform);
				else
					location = SVG.transformPoint({ x: parsed.attributes.POINTS[pntCount - 3], y: parsed.attributes.POINTS[pntCount - 2] }, transform);

				rob.push(SVG.transformPoint({ x: parsed.attributes.POINTS[0], y: parsed.attributes.POINTS[1]}, transform));
				rob.push({ z: 1 });

				for (let i = 2; i < parsed.attributes.POINTS.length - 1; i += 2)
					rob.push(SVG.transformPoint({ x: parsed.attributes.POINTS[i], y: parsed.attributes.POINTS[i + 1]}, transform));

				rob.push({ z: 0 });

				break;

			case 'PATH':
				if (!parsed.attributes.hasOwnProperty('D') || !isNaN(parsed.attributes.D[0]))
					return null;

				var cmd, index = 0, zVal = 0;
				var bezier_lastControlPoint = { x: null, y: null };

				var loc = { x: 0.0, y: 0.0 }, locOffset;
				var controlPoint1, controlPoint2, endPoint;
				var bezier_points, dx, dy;
				var rx, ry, angle, largeArcFlag, sweepFlag;
				var subpathStart = { x: parsed.attributes.D[1], y: parsed.attributes.D[2] };

				const MIN_LINE_LENGTH = 0.05;

				var simpLineStartX = 0.0,
					simpLineStartY = 0.0;

				var tmpX, tmpY, dx, dy, dt;

				var path = [];

				while (index < parsed.attributes.D.length) {
					if (isNaN(parsed.attributes.D[index]))
						cmd = parsed.attributes.D[index++];

					locOffset = { x: 0.0, y: 0.0 };

					switch (cmd) {
						case 'M':
						case 'm':
							if (cmd === 'M')
								cmd = 'L';
							else if (cmd === 'm')
								cmd = 'l';

							tmpX = parsed.attributes.D[index++];
							tmpY = parsed.attributes.D[index++];

							dt = SVG.transformPoint({ x: ((cmd === 'L' ? 0.0 : loc.x) + tmpX), y: ((cmd === 'L' ? 0.0 : loc.y) + tmpY) }, transform);

							dx = Math.abs(dt.x - simpLineStartX);
							dy = Math.abs(dt.y - simpLineStartY);

							if (index > 2 && dx < MIN_LINE_LENGTH && dy < MIN_LINE_LENGTH)
								;//break;

							if (cmd === 'L') {
								loc.x = 0.0;
								loc.y = 0.0;
							}

							loc.x += tmpX;
							loc.y += tmpY;

							subpathStart.x = loc.x;
							subpathStart.y = loc.y;

							if (zVal === 1) {
								zVal = 0;
								path.push({ z: 0 });
							}

							simpLineStartX = dt.x;
							simpLineStartY = dt.y;

							path.push({ x: loc.x, y: loc.y });

							break;

						case 'L':
						case 'l':
							tmpX = parsed.attributes.D[index++];
							tmpY = parsed.attributes.D[index++];

							dt = SVG.transformPoint({ x: ((cmd === 'L' ? 0.0 : loc.x) + tmpX), y: ((cmd === 'L' ? 0.0 : loc.y) + tmpY) }, transform);

							dx = Math.abs(dt.x - simpLineStartX);
							dy = Math.abs(dt.y - simpLineStartY);

							if (dx < MIN_LINE_LENGTH && dy < MIN_LINE_LENGTH)
								;//break;

							if (cmd === 'L') {
								loc.x = 0.0;
								loc.y = 0.0;
							}

							loc.x += tmpX;
							loc.y += tmpY;

							simpLineStartX = dt.x;
							simpLineStartY = dt.y;

							if (zVal === 0) {
								zVal = 1;
								path.push({ z: 1 });
							}

							path.push({ x: loc.x, y: loc.y });

							break;

						case 'V':
						case 'v':
							tmpY = parsed.attributes.D[index++];

							dt = SVG.transformPoint({ x: (cmd === 'L' ? 0.0 : loc.x), y: ((cmd === 'L' ? 0.0 : loc.y) + tmpY) }, transform);

							dx = Math.abs(dt.x - simpLineStartX);
							dy = Math.abs(dt.y - simpLineStartY);

							if (dt.x < MIN_LINE_LENGTH && dt.y < MIN_LINE_LENGTH)
								;//break;

							if (cmd === 'V')
								loc.y = 0.0;
							
							loc.y += tmpY;

							simpLineStartX = dt.x;
							simpLineStartY = dt.y;

							if (zVal === 0) {
								zVal = 1;
								path.push({ z: 1 });
							}

							path.push({ x: loc.x, y: loc.y });

							break;

						case 'H':
						case 'h':
							tmpX = parsed.attributes.D[index++];

							dx = (loc.x + tmpX) - simpLineStartX;
							
							dt = SVG.transformPoint({ x: ((cmd === 'L' ? 0.0 : loc.x) + tmpX), y: (cmd === 'L' ? 0.0 : loc.y) }, transform);

							dx = Math.abs(dt.x - simpLineStartX);
							dy = Math.abs(dt.y - simpLineStartY);

							if (dt.x < MIN_LINE_LENGTH && dt.y < MIN_LINE_LENGTH)
								;//break;

							if (cmd === 'H')
								loc.x = 0.0;

							loc.x += tmpX;

							simpLineStartX = dt.x;
							simpLineStartY = dt.y;

							if (zVal === 0) {
								zVal = 1;
								path.push({ z: 1 });
							}

							path.push({ x: loc.x, y: loc.y });

							break;

						case 'Z':
						case 'z':
							loc.x = subpathStart.x;
							loc.y = subpathStart.y;

							if (zVal === 0) {
								zVal = 1;
								path.push({ z: 1 });
							}

							path.push({ x: loc.x, y: loc.y });

							break;

						case 'C':
							locOffset = { x: loc.x, y: loc.y };
						case 'c':
							controlPoint1 = { x: (loc.x - locOffset.x) + parsed.attributes.D[index++], y: (loc.y - locOffset.y) + parsed.attributes.D[index++] };
							controlPoint2 = { x: (loc.x - locOffset.x) + parsed.attributes.D[index++], y: (loc.y - locOffset.y) + parsed.attributes.D[index++] };
							endPoint = { x: (loc.x - locOffset.x) + parsed.attributes.D[index++], y: (loc.y - locOffset.y) + parsed.attributes.D[index++] };

							bezier_points = SVG.recursive_cubicBezier(loc.x, loc.y, controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
							bezier_lastControlPoint = { x: controlPoint2.x, y: controlPoint2.y };

							if (zVal === 0) {
								zVal = 1;
								path.push({ z: 1 });
							}

							for (let i = 0; i < bezier_points.length; i++)
								path.push({ x: bezier_points[i].x, y: bezier_points[i].y });

							loc.x = endPoint.x;
							loc.y = endPoint.y;

							path.push({ x: loc.x, y: loc.y });

							break;

						case 'S':
							locOffset = { x: loc.x, y: loc.y };
						case 's':
							if (!bezier_lastControlPoint || bezier_lastControlPoint.x == null || bezier_lastControlPoint.y == null)
								bezier_lastControlPoint = { x: loc.x, y: loc.y };

							dx = loc.x - bezier_lastControlPoint.x;
							dy = loc.y - bezier_lastControlPoint.y;

							controlPoint1.x = loc.x + dx;
							controlPoint1.y = loc.y + dy;

							controlPoint2 = { x: (loc.x - locOffset.x) + parsed.attributes.D[index++], y: (loc.y - locOffset.y) + parsed.attributes.D[index++] };
							endPoint = { x: (loc.x - locOffset.x) + parsed.attributes.D[index++], y: (loc.y - locOffset.y) + parsed.attributes.D[index++] };

							bezier_points = SVG.recursive_cubicBezier(loc.x, loc.y, controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
							bezier_lastControlPoint = { x: controlPoint2.x, y: controlPoint2.y };

							if (zVal === 0) {
								zVal = 1;
								path.push({ z: 1 });
							}

							for (let i = 0; i < bezier_points.length; i++)
								path.push({ x: bezier_points[i].x, y: bezier_points[i].y });

							loc.x = endPoint.x;
							loc.y = endPoint.y;

							path.push({ x: loc.x, y: loc.y });

							break;

						case 'Q':
							locOffset = { x: loc.x, y: loc.y };
						case 'q':
							controlPoint1 = { x: (loc.x - locOffset.x) + parsed.attributes.D[index++], y: (loc.y - locOffset.y) + parsed.attributes.D[index++] };
							endPoint = { x: (loc.x - locOffset.x) + parsed.attributes.D[index++], y: (loc.y - locOffset.y) + parsed.attributes.D[index++] };

							bezier_points = SVG.recursive_quadraticBezier(loc.x, loc.y, controlPoint1.x, controlPoint1.y, endPoint.x, endPoint.y);
							bezier_lastControlPoint = { x: controlPoint1.x, y: controlPoint1.y };

							if (zVal === 0) {
								zVal = 1;
								path.push({ z: 1 });
							}

							for (let i = 0; i < bezier_points.length; i++)
								path.push({ x: bezier_points[i].x, y: bezier_points[i].y });

							loc.x = endPoint.x;
							loc.y = endPoint.y;

							path.push({ x: loc.x, y: loc.y });

							break;

						case 'T':
							locOffset = { x: loc.x, y: loc.y };
						case 't':
							if (!bezier_lastControlPoint || bezier_lastControlPoint.x == null || bezier_lastControlPoint.y == null)
								bezier_lastControlPoint = { x: loc.x, y: loc.y };

							dx = loc.x - bezier_lastControlPoint.x;
							dy = loc.y - bezier_lastControlPoint.y;

							controlPoint1.x = loc.x + dx;
							controlPoint1.y = loc.y + dy;

							endPoint = { x: (loc.x - locOffset.x) + parsed.attributes.D[index++], y: (loc.y - locOffset.y) + parsed.attributes.D[index++] };

							bezier_points = SVG.recursive_quadraticBezier(loc.x, loc.y, controlPoint1.x, controlPoint1.y, endPoint.x, endPoint.y);
							bezier_lastControlPoint = { x: controlPoint1.x, y: controlPoint1.y };

							if (zVal === 0) {
								zVal = 1;
								path.push({ z: 1 });
							}

							for (let i = 0; i < bezier_points.length; i++)
								path.push({ x: bezier_points[i].x, y: bezier_points[i].y });

							loc.x = endPoint.x;
							loc.y = endPoint.y;

							path.push({ x: loc.x, y: loc.y });

							break;

						case 'A':
							locOffset = { x: loc.x, y: loc.y };
						case 'a':
							rx = parsed.attributes.D[index++];
							ry = parsed.attributes.D[index++];
							angle = parsed.attributes.D[index++];
							largeArcFlag = parsed.attributes.D[index++];
							sweepFlag = parsed.attributes.D[index++];
							endPoint = { x: (loc.x - locOffset.x) + parsed.attributes.D[index++], y: (loc.y - locOffset.y) + parsed.attributes.D[index++] };

							let arcObj = SVG.arcToCenter(loc.x, loc.y, rx, ry, angle, largeArcFlag, sweepFlag, endPoint.x, endPoint.y);
							let angleRange = Math.abs(arcObj.endAngle - arcObj.startAngle) * (180.0 / Math.PI);

							segment_count = Math.PI / Math.acos((Math.max(rx, ry) - arc_error) / Math.max(rx, ry));
							angle_step = 360.0 / segment_count;
							
							segment_count /= (360.0 / angleRange);
							cur_angle = arcObj.startAngle * (180.0 / Math.PI);

							if (zVal === 0) {
								zVal = 1;
								path.push({ z: 1 });
							}

							for (let i = 0; i < segment_count; i++) {
								cur_point = SVG.point_on_ellipse(arcObj.cx, arcObj.cy, rx, ry, cur_angle);
								path.push({ x: cur_point.x, y: cur_point.y });

								cur_angle += angle_step;
							}

							loc.x = endPoint.x;
							loc.y = endPoint.y;

							path.push({ x: loc.x, y: loc.y });

							break;

						default:
							while (!isNaN(parsed.attributes.D[index++ + 1]));

							break;
					}

					if (cmd.toUpperCase() !== 'C' && cmd.toUpperCase() !== 'Q')
						bezier_lastControlPoint = { x: null, y: null };

				}

				if (zVal === 1)
					path.push({ z: 0 });

				var transformed;
				for (let i = 0; i < path.length; i++) {
					if (path[i].hasOwnProperty('z'))
						rob.push({ z: path[i].z });
					else {
						transformed = SVG.transformPoint({ x: path[i].x, y: path[i].y }, transform);
						rob.push({ x: transformed.x, y: transformed.y });
					}
				}

				location = { x: transformed.x, y: transformed.y };

				break;

			default:
				return null;
		}

		return { location: location, data: rob };
	},

	autoSizeRaw: (raw) => {
		let i = -1;

		while (!raw[++i].hasOwnProperty('x'));

		var minX = raw[i].x, minY = raw[i].y;
		var maxX = raw[i].x, maxY = raw[i].y;

		for (; i < raw.length; i++) {
			if (raw[i].hasOwnProperty('x')) {
				if (raw[i].x < minX)
					minX = raw[i].x;
				else if (raw[i].x > maxX)
					maxX = raw[i].x;
			}

			if (raw[i].hasOwnProperty('y')) {
				if (raw[i].y < minY)
					minY = raw[i].y;
				else if (raw[i].y > maxY)
					maxY = raw[i].y;
			}
		}

		var width = maxX - minX;
		var height = maxY - minY;

		for (let i = 0; i < raw.length; i++) {
			if (raw[i].hasOwnProperty('x'))
				raw[i].x -= minX;

			if (raw[i].hasOwnProperty('y'))
				raw[i].y -= minY;
		}

		return { width: width, height: height };
	},

	point_on_circle: (centerX, centerY, radius, angle) => {
		return SVG.point_on_ellipse(centerX, centerY, radius, radius, angle);
	},

	point_on_ellipse: (centerX, centerY, radiusX, radiusY, angle) => {
		if (angle >= 360.0)
			angle -= 360.0;

		var theta = angle * (Math.PI / 180.0);

		return { x: centerX + radiusX * Math.cos(theta), y: centerY + radiusY * Math.sin(theta) };
	},

	// From cuixiping on StackOverflow [ https://stackoverflow.com/questions/9017100/calculate-center-of-svg-arc ]
	radian: (ux, uy, vx, vy) => {
	    var  dot = ux * vx + uy * vy;
	    var  mod = Math.sqrt( ( ux * ux + uy * uy ) * ( vx * vx + vy * vy ) );
	    var  rad = Math.acos( dot / mod );
	    
	    if( ux * vy - uy * vx < 0.0 )
	        rad = -rad;

	    return rad;
	},

	// From cuixiping on StackOverflow [ https://stackoverflow.com/questions/9017100/calculate-center-of-svg-arc ]
	arcToCenter: (x1, y1, rx, ry, phi, fA, fS, x2, y2) => {
	    var cx, cy, startAngle, deltaAngle, endAngle;
	    var PIx2 = Math.PI * 2.0;

	    if (rx < 0)
	        rx = -rx;
	    if (ry < 0)
	        ry = -ry;

	    if (rx == 0.0 || ry == 0.0) // invalid arguments
	        throw Error('rx and ry can not be 0');

	    var s_phi = Math.sin(phi);
	    var c_phi = Math.cos(phi);
	    var hd_x = (x1 - x2) / 2.0; // half diff of x
	    var hd_y = (y1 - y2) / 2.0; // half diff of y
	    var hs_x = (x1 + x2) / 2.0; // half sum of x
	    var hs_y = (y1 + y2) / 2.0; // half sum of y

	    // F6.5.1
	    var x1_ = c_phi * hd_x + s_phi * hd_y;
	    var y1_ = c_phi * hd_y - s_phi * hd_x;

	    // F.6.6 Correction of out-of-range radii
	    //   Step 3: Ensure radii are large enough
	    var lambda = (x1_ * x1_) / (rx * rx) + (y1_ * y1_) / (ry * ry);
	    if (lambda > 1) {
	        rx = rx * Math.sqrt(lambda);
	        ry = ry * Math.sqrt(lambda);
	    }

	    var rxry = rx * ry;
	    var rxy1_ = rx * y1_;
	    var ryx1_ = ry * x1_;
	    var sum_of_sq = rxy1_ * rxy1_ + ryx1_ * ryx1_; // sum of square
	    if (!sum_of_sq)
	        throw Error('start point can not be same as end point');

	    var coe = Math.sqrt(Math.abs((rxry * rxry - sum_of_sq) / sum_of_sq));
	    if (fA == fS)
	    	coe = -coe;

	    // F6.5.2
	    var cx_ = coe * rxy1_ / ry;
	    var cy_ = -coe * ryx1_ / rx;

	    // F6.5.3
	    cx = c_phi * cx_ - s_phi * cy_ + hs_x;
	    cy = s_phi * cx_ + c_phi * cy_ + hs_y;

	    var xcr1 = (x1_ - cx_) / rx;
	    var xcr2 = (x1_ + cx_) / rx;
	    var ycr1 = (y1_ - cy_) / ry;
	    var ycr2 = (y1_ + cy_) / ry;

	    // F6.5.5
	    startAngle = SVG.radian(1.0, 0.0, xcr1, ycr1);

	    // F6.5.6
	    deltaAngle = SVG.radian(xcr1, ycr1, -xcr2, -ycr2);
	    
	    while (deltaAngle > PIx2) { deltaAngle -= PIx2; }
	    while (deltaAngle < 0.0) { deltaAngle += PIx2; }
	    
	    if (fS == false || fS == 0)
	    	deltaAngle -= PIx2;
	    
	    endAngle = startAngle + deltaAngle;
	    
	    while (endAngle > PIx2) { endAngle -= PIx2; }
	    while (endAngle < 0.0) { endAngle += PIx2; }

	    var outputObj = {
	        cx: cx,
	        cy: cy,
	        startAngle: startAngle,
	        deltaAngle: deltaAngle,
	        endAngle: endAngle,
	        clockwise: (fS == true || fS == 1)
	    }

	    return outputObj;
	},

	// FROM The AGG Project - Anti-Grain Geometry
	recursive_quadraticBezier: (x1, y1, x2, y2, x3, y3, level = 0) => {
		if (level > 32)
			return;

		const x12   = (x1 + x2) / 2;                
		const y12   = (y1 + y2) / 2;
		const x23   = (x2 + x3) / 2;
		const y23   = (y2 + y3) / 2;
		const x123  = (x12 + x23) / 2;
		const y123  = (y12 + y23) / 2;

		const m_distance_tolerance = 0.25; // 0.5^2
		const m_angle_tolerance = 0.1;
		const curve_collinearity_epsilon = 1e-30;
		const curve_angle_tolerance_epsilon = 0.01;

		var dx = x3 - x1;
		var dy = y3 - y1;
		var d = Math.abs(((x2 - x3) * dy - (y2 - y3) * dx));

        var points = [];

		if (d > curve_collinearity_epsilon) {
			if (d * d <= m_distance_tolerance * (dx*dx + dy*dy)) {
				if (m_angle_tolerance < curve_angle_tolerance_epsilon) {
					points.push({ x: x123, y: y123 });
					return points;
				}

				var da = Math.abs(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y2 - y1, x2 - x1));
				if (da >= Math.PI)
					da = 2*Math.PI - da;

				if (da < m_angle_tolerance) {
					points.push({ x: x123, y: y123 });
					return points;                 
				}
			}
		}
		else {
			dx = x123 - (x1 + x3) / 2;
			dy = y123 - (y1 + y3) / 2;
			
			if (dx*dx + dy*dy <= m_distance_tolerance) {
				points.push({ x: x123, y: y123 });
				return points;
			}
		}

		points = points.concat(SVG.recursive_quadraticBezier(x1, y1, x12, y12, x123, y123, level + 1));
		points = points.concat(SVG.recursive_quadraticBezier(x123, y123, x23, y23, x3, y3, level + 1));

		return points;
	},

	// FROM The AGG Project - Anti-Grain Geometry
	recursive_cubicBezier: (x1, y1, x2, y2, x3, y3, x4, y4, level = 0) => {
		if (level > 32)
			return;

		const x12   = (x1 + x2) / 2;
        const y12   = (y1 + y2) / 2;
        const x23   = (x2 + x3) / 2;
        const y23   = (y2 + y3) / 2;
        const x34   = (x3 + x4) / 2;
        const y34   = (y3 + y4) / 2;
        const x123  = (x12 + x23) / 2;
        const y123  = (y12 + y23) / 2;
        const x234  = (x23 + x34) / 2;
        const y234  = (y23 + y34) / 2;
        const x1234 = (x123 + x234) / 2;
        const y1234 = (y123 + y234) / 2;

        const m_distance_tolerance = 0.25; // 0.5^2
        const m_angle_tolerance = 0.1;
        const m_cusp_limit = 0.0;
        const curve_distance_epsilon = 1e-30;
        const curve_collinearity_epsilon = 1e-30;
        const curve_angle_tolerance_epsilon = 0.01;

        var points = [];

        if (level > 0) {
        	var dx = x4 - x1;
            var dy = y4 - y1;

            var d2 = Math.abs(((x2 - x4) * dy - (y2 - y4) * dx));
            var d3 = Math.abs(((x3 - x4) * dy - (y3 - y4) * dx));

            var da1, da2;

			if (d2 > curve_collinearity_epsilon && d3 > curve_collinearity_epsilon) {
				if ((d2 + d3) * (d2 + d3) <= m_distance_tolerance * (dx*dx + dy*dy)) {
					if (m_angle_tolerance < curve_angle_tolerance_epsilon) {
						points.push({ x: x1234, y: y1234 });
						return points;
					}

					var a23 = Math.atan2(y3 - y2, x3 - x2);
					da1 = Math.abs(a23 - Math.atan2(y2 - y1, x2 - x1));
					da2 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - a23);
					
					if (da1 >= Math.PI)
						da1 = 2*Math.PI - da1;
					if (da2 >= Math.PI)
						da2 = 2*Math.PI - da2;

					if (da1 + da2 < m_angle_tolerance) {
						points.push({ x: x1234, y: y1234 });
						return points;
					}

					if (m_cusp_limit != 0.0) {
						if (da1 > m_cusp_limit) {
							points.push({ x: x2, y: y2 });
							return points;
						}

						if (da2 > m_cusp_limit) {
							points.push({ x: x3, y: y3 });
							return points;
						}
					}
				}
			}
			else {
                if (d2 > curve_collinearity_epsilon) {
                    if (d2 * d2 <= m_distance_tolerance * (dx*dx + dy*dy)) {
                        if (m_angle_tolerance < curve_angle_tolerance_epsilon) {
                            points.push({ x: x1234, y: y1234 });
                            return points;
                        }

                        da1 = Math.abs(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y2 - y1, x2 - x1));
                        if (da1 >= Math.PI)
                        	da1 = 2*Math.PI - da1;

                        if (da1 < m_angle_tolerance) {
                            points.push({ x: x2, y: y2 });
                            points.push({ x: x3, y: y3 });
                            return points;
                        }

                        if (m_cusp_limit != 0.0) {
                            if(da1 > m_cusp_limit) {
                                points.push({ x: x2, y: y2 });
                                return points;
                            }
                        }
                    }
                }
                else
                	if (d3 > curve_collinearity_epsilon) {
                    if (d3 * d3 <= m_distance_tolerance * (dx*dx + dy*dy)) {
                        if (m_angle_tolerance < curve_angle_tolerance_epsilon) {
                            points.push({ x: x1234, y: y1234 });
                            return points;
                        }

                        da1 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - Math.atan2(y3 - y2, x3 - x2));
                        if (da1 >= Math.PI) da1 = 2*Math.PI - da1;

                        if (da1 < m_angle_tolerance) {
                            points.push({ x: x2, y: y2 });
                            points.push({ x: x3, y: y3 });
                            return points;
                        }

                        if (m_cusp_limit != 0.0) {
                            if(da1 > m_cusp_limit) {
                                points.push({ x: x3, y: y3 });
                                return points;
                            }
                        }
                    }
                }
                else {
                    dx = x1234 - (x1 + x4) / 2;
                    dy = y1234 - (y1 + y4) / 2;
                    if (dx*dx + dy*dy <= m_distance_tolerance) {
                        points.push({ x: x1234, y: y1234 });
                        return points;
                    }
                }
            }
        }

        points = points.concat(SVG.recursive_cubicBezier(x1, y1, x12, y12, x123, y123, x1234, y1234, level + 1));
        points = points.concat(SVG.recursive_cubicBezier(x1234, y1234, x234, y234, x34, y34, x4, y4, level + 1));

        return points;
	},

	polylinesFromROB: (filename) => {
		return new Promise((resolve, reject) => {
			ROB.load(filename).then(result => {
				if (result[0].cmd.toLowerCase() !== 'rob')
					reject(Error("File does not contain a valid header."));

				var max;
				if (result[0].args && result[0].args.fileRange)
					max = { width: parseInt(result[0].args.fileRange.split(' ')[2]), height: parseInt(result[0].args.fileRange.split(' ')[3]) };
				else
					max = ROB.dimensions(result);

				var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				svg.setAttributeNS(null, 'version', '1.1');
				svg.setAttributeNS(null, 'viewBox', '0 0 ' + max.width + ' ' + max.height);
				svg.setAttributeNS(null, 'style', 'position: absolute; stroke: #0288d1; stroke-width: 0.4; fill: none;'); //z-index: 999

				for (let i = 1; i < result.length; i++) {
					let points = '';
					if (result[i].cmd === 'polyline') {
						for (let j = 0; j < result[i].data.length; j++)
							points += result[i].data[j].x + ',' + (max.height - result[i].data[j].y) + (j === result[i].data.length - 1 ? '' : ' ');
						
						let polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
						polyline.setAttributeNS(null, 'points', points);

						svg.appendChild(polyline);
					}
				}

				if (svg)
					resolve(svg);
				else
					reject(Error("Error converting SVG to ROB!"));
			})
			.catch(error => {
				console.log(error);
			});
		});
	},

	pathsFromROB: (filename) => {
		return new Promise((resolve, reject) => {
			ROB.load(filename).then(result => {
				var max;
				if (result.settings.hasOwnProperty('size'))
					max = result.settings.size;
				else
					max = ROB.dimensions(result);

				var header = {};
				header.title = '';
				header.creationDate = '';
				header.fileSize = 0;
				header.lineCount = 0;
				header.lineLength = 0;

				var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				svg.setAttributeNS(null, 'version', '1.1');
				svg.setAttributeNS(null, 'viewBox', '0 0 ' + max.width + ' ' + max.height);
				svg.setAttributeNS(null, 'transform', 'matrix(1 0 0 -1 0 0)');
				svg.setAttributeNS(null, 'style', 'position: absolute; stroke: #222222; stroke-width: 0.4; fill: none;');

				let z0 = 0, z1 = 0;
				let points0 = '', points1 = '';
				var movePointX, movePointY;

				for (let i = 0; i < result.commands.length; i++) {
					if (result.commands[i].hasOwnProperty('z')) {
						z = Number(result.commands[i].z)
						if (z === 1 && i > 0) {
							if (result.commands[i].arm === 1)
								points1 = result.commands[i-1].x + ',' + result.commands[i-1].y + ' ';
							else
								points0 = result.commands[i-1].x + ',' + result.commands[i-1].y + ' ';
						}
						else {
							let p = result.commands[i].arm === 1 ? points1 : points0;
							if (p !== '') {
								let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
								path.setAttributeNS(null, 'd', 'M' + (result.commands[i].arm === 1 ? points1 : points0).trim());

								let pathLength = path.getTotalLength();
								path.style.strokeDasharray  = pathLength + ',' + pathLength;
								path.style.strokeDashoffset = pathLength;

								header.lineLength += pathLength;
								header.lineCount++;

								svg.appendChild(path);
							}
						}
					}
					else if (result.commands[i].hasOwnProperty('x') && result.commands[i].hasOwnProperty('y')) {
						if (result.commands[i].arm === 1)
							points1 += result.commands[i].x + ',' + result.commands[i].y + ' ';
						else
							points0 += result.commands[i].x + ',' + result.commands[i].y + ' ';
					}
				}

				if (svg)
					resolve({ header: header, svg: svg });
				else
					reject(Error("Error converting SVG to ROB!"));
			})
			.catch(error => {
				console.log(error);
			});
		});
	},

	polylinesToPaths(svg) {
		var svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg2.setAttributeNS(null, 'version', svg.getAttribute('version'));
		svg2.setAttributeNS(null, 'viewBox', svg.getAttribute('viewBox'));
		svg2.setAttributeNS(null, 'style',   svg.getAttribute('style'));

		var paths = svg.querySelectorAll('polyline');

		for (let i = 0; i < paths.length; i++) {
			let path = document.createElementNS(paths[i].ownerSVGElement.namespaceURI, 'path');
			let points = paths[i].getAttribute('points');
			path.setAttribute('d', 'M' + points);

			let pathLength = path.getTotalLength();
			path.style.strokeDasharray  = pathLength + ',' + pathLength;
			path.style.strokeDashoffset = pathLength;

			svg2.appendChild(path);
		}

		return svg2;
	},

	playPathAnimation(svg) {
		var paths = svg.querySelectorAll('path');

		for (let i = 0; i < paths.length; i++) {
			paths[i].getBoundingClientRect();
			paths[i].style.transition = paths[i].style.WebkitTransition = 'stroke-dashoffset 5s ease-in-out';
			paths[i].style.strokeDashoffset = '0';
		}
	},

	erasePathAnimation(svg) {
		var paths = svg.querySelectorAll('path');

		for (let i = 0; i < paths.length; i++) {
			paths[i].getBoundingClientRect();
			paths[i].style.transition = paths[i].style.WebkitTransition = 'stroke-dashoffset 1s ease-in-out';
			paths[i].style.strokeDashoffset = paths[i].getTotalLength();
		}
	}
}