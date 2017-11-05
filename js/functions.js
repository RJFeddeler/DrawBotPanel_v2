bgcanvas = document.getElementById('idCanvas');
$window = $(window);
$document = $(document);
$screen = screen;
$screenWidth = 0;
$screenHeight = 0;
$lastMouseMove = new Date();
$mouseX = -999;
$mouseY = -999;

function windowWidth() 		{ return document.documentElement.clientWidth;	}
function windowHeight() 	{ return document.documentElement.clientHeight;	}
function documentWidth() 	{ return $document.width(); 					}
function documentHeight() 	{ return $document.height(); 					}
function screenWidth() 		{ return $screen.width(); 						}
function screenHeight() 	{ return $screen.height(); 						}
function divWidth(name) 	{ return $('#' + name).width(); 				}
function divHeight(name) 	{ return $('#' + name).height(); 				}

function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min) ) + min; }

function updateMouse(e) {
	var rect = bgcanvas.getBoundingClientRect();
    $mouseX = e.clientX - rect.left;
    $mouseY = e.clientY - rect.top;
	$lastMouseMove = new Date();
}