var LocalFile = {
	loadImageFile(filename) {
		return new Promise((resolve, reject) => {
			var img = new Image();
			img.addEventListener("load", onloadImage);
			img.src = URL.createObjectURL(filename);

			function onloadImage() {
				if (parseInt(img.width) && parseInt(img.height))
					resolve(img);
				else
					reject('Failed to load image file.');
			}
		});
	},

	loadTextFile(file) {
		return new Promise((resolve, reject) => {
			var fr = new FileReader();
				
			fr.onload = function(e) {
				if (e.target.result.length > 0)
					resolve(e.target.result);
				else
					reject('Failed to load text file.');
			};

			fr.readAsText(file);
		});
	},

	loadTextFileAsLines(file) {
		return new Promise((resolve, reject) => {
			LocalFile.loadTextFile(file).then(file => {
				var lines = file.split(/[\r\n]+/g);

				if (lines.length > 0) {
					lines.forEach((line, i) => { lines[i] = line.trim(); });
					resolve(lines);
				}
				else
					reject(Error('Error reading text file:  No lines found'));
			}).catch(error => {
				reject(Error(error));
			});
		});
	}
};

var ServerFile = {
	loadImageFile(filename) {
		return new Promise((resolve, reject) => {
			var img = new Image();
			img.src = filename;

			img.onload = () => {
				if (parseInt(img.width) && parseInt(img.height))
					resolve(img);
				else
					reject('Failed to load image file.');
			};

			img.onerror = () => reject(img.statusText);
		});
	},

	loadTextFile(filename) {
		return new Promise((resolve, reject) => {
			let fileRequest = new XMLHttpRequest();
			fileRequest.open("GET", filename, true);

			fileRequest.onload = () => {
				if (fileRequest.status >= 200 && fileRequest.status < 300)
					resolve(fileRequest.response);
				else
					reject(fileRequest.statusText);
			};

			fileRequest.onerror = () => reject(fileRequest.statusText);
			fileRequest.send();
		});
	},

	loadTextFileAsLines(filename) {
		return new Promise((resolve, reject) => {
			ServerFile.loadTextFile(filename).then(file => {
				var lines = file.split(/[\r\n]+/g);

				if (lines.length > 0)
					resolve(lines);
				else
					reject(Error('Error reading text file:  No lines found'));
			}).catch(error => {
				reject(Error(error));
			});
		});
	}
};
