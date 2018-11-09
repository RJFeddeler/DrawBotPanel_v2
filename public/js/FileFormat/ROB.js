var ROB = {
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

	loadFromLocal: (filename) => {
		return new Promise((resolve, reject) => {
			LocalFile.loadTextFileAsLines(filename).then(lines => {
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

	load: (fileName) => {
		return new Promise((resolve, reject) => {
			ServerFile.loadTextFileAsLines(fileName).then(lines => {
				var cmd, arm;
				var result = { settings: {}, commands: [] };
				
				for (let i = 0; i < lines.length; i++) {
					let line = lines[i].trim().split(/[\s,]+/g);

					if (!isNaN(line[0]))
						continue;

					cmd = line[0].toUpperCase();

					switch (cmd) {
						case 'D':
							result.settings.size = { width: Number(line[1]), height: Number(line[2]) };

							break;

						case 'M0':
							arm = 0;

						case 'M1':
							if (cmd === 'M1')
								arm = 1;

							result.commands.push({ arm: arm, x: Number(line[1]), y: Number(line[2]) });
							
							break;

						case 'Z0':
							arm = 0;

						case 'Z1':
							if (cmd === 'Z1')
								arm = 1;

							result.commands.push({ arm: arm, z: Number(line[1]) });
							
							break;

						default:
							
							break;
					}
				}

				if (result.commands.length > 0)
					resolve(result);
				else
					reject(Error('No Valid ROB Data Found!'));
			}).catch(error => {
				reject(Error(error));
			});
		});
	},

	dimensions: (file) => {
		let maxX = 0, maxY = 0;
		for (let i = 0; i < file.commands.length; i++) {
			if (file.commands[i].hasOwnProperty('x') && Number(file.commands[i].x) > maxX)
				maxX = Math.ceil(Number(file.commands[i].x));
			if (file.commands[i].hasOwnProperty('y') && Number(file.commands[i].y) > maxY)
				maxY = Math.ceil(Number(file.commands[i].y));
		}

		return { width: maxX, height: maxY };
	},

	// EXPERIMENTAL
	reduce: (data, minimum = 0.05) => {
		var start0 = { x: null, y: null }, start1 = { x: null, y: null };
		var end0   = { x: null, y: null }, end1   = { x: null, y: null };

		for (let i = 0; i < data.length; i++) {
			if (data[i].hasOwnProperty('x') && data[i].hasOwnProperty('y')) {
				if (data[i].hasOwnProperty('arm') && data[i].arm === 1) {
					if (start1.x === null || start1.y === null) {
						start1.x = data[i].x;
						start1.y = data[i].y;
					}
					else {
						end1.x = data[i].x;
						end1.y = data[i].y;

						let dx = end1.x - start1.x;
						let dy = end1.y - start1.y;

						if (Math.sqrt(dx*dx + dy*dy) < minimum)
							data.splice(i--, 1);
						else {
							start1.x = end1.x;
							start1.y = end1.y;
						}
					}
				}
				else {
					if (start0.x === null || start0.y === null) {
						start0.x = data[i].x;
						start0.y = data[i].y;
					}
					else {
						end0.x = data[i].x;
						end0.y = data[i].y;

						let dx = end0.x - start0.x;
						let dy = end0.y - start0.y;

						if (Math.sqrt(dx*dx + dy*dy) < minimum)
							data.splice(i--, 1);
						else {
							start0.x = end0.x;
							start0.y = end0.y;
						}
					}
				}
			}
		}

		return data;
	}
}