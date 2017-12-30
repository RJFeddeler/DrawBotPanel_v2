bgcanvas = document.getElementById('idCanvas');
$window = $(window);
$document = $(document);
$screen = screen;
$screenWidth = 0;
$screenHeight = 0;

function windowWidth() 		{ return document.documentElement.clientWidth;	}
function windowHeight() 	{ return document.documentElement.clientHeight;	}
function documentWidth() 	{ return $document.width(); 					}
function documentHeight() 	{ return $document.height(); 					}
function screenWidth() 		{ return $screen.width(); 						}
function screenHeight() 	{ return $screen.height(); 						}
function divWidth(name) 	{ return $('#' + name).width(); 				}
function divHeight(name) 	{ return $('#' + name).height(); 				}

function addEventListeners(el, s, fn) 		{ s.split(' ').forEach(e => el.addEventListener(e, fn, true)); 	}
function removeEventListeners(el, s, fn) 	{ s.split(' ').forEach(e => el.removeEventListener(e, fn)); }

function emptyArray(arr) 		{ while (arr.length > 0) arr.pop(); 						return arr;	}
function clearDiv(div) 			{ while(div.firstChild) div.removeChild(div.firstChild); 	return div; }
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min) ) + min; 	}
function atan2ToArc(value) 		{ return (-value < 0) ? (-value + (2 * Math.PI)) : -value; 	}