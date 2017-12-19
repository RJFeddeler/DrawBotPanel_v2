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

function clearDiv(div) 			{ while(div.firstChild) div.removeChild(div.firstChild); 	}
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min) ) + min; 	}
function atan2ToArc(value) 		{ return (-value < 0) ? (-value + (2 * Math.PI)) : -value; 	}