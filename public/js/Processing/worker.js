importScripts('Canny.js');

self.addEventListener('message', function(e) {
  var data = e.data;

  switch (data.cmd) {
    case 'processImg':
    	var result = Canny.process(
    		data.image,
    		data.settings.blurKernel,
    		data.settings.blurSigma,
    		data.settings.cannyAlgo,
    		data.settings.cannyKernel,
    		data.settings.cannySigma,
    		data.settings.cannyHystLow,
    		data.settings.cannyHystHigh,
    		data.settings.invert
    	);

     	self.postMessage(result);
     	break;
    default:
    	self.postMessage('UNKOWN COMMAND: ' + data.msg);
    	break;
    }
}, false);