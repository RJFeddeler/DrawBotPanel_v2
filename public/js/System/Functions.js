$window = $(window);
$document = $(document);
$screen = screen;
$screenWidth = 0;
$screenHeight = 0;

var readyState = {
	INIT: 			1,
	STALLING: 		2,
	WAITINGFORDATA: 3,
	WAITINGFORUSER: 4,
	FINAL: 			5
}

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

function beautifyDate(u){var r=u.replace(/\./g,' ').split(' ');var m,d,y;switch(r[0].toLowerCase()){case '01':case '1':case 'january':case 'jan':m='January';break;case '02':case '2':case 'february':case 'feb':m='February';break;case '03':case '3':case 'march':case 'mar':m='March';break;case '04':case '4':case 'april':case 'apr':m='April';break;case '05':case '5':case 'may':m='May';break;case '06':case '6':case 'june':case 'jun':m='June';break;case '07':case '7':case 'july':case 'jul':m='July';break;case '08':case '8':case 'august':case 'aug':m='August';break;case '09':case '9':case 'september':case 'sep':m='September';break;case '10':case 'october':case 'oct':m='October';break;case '11':case 'november':case 'nov':m='November';break;case '12':case 'december':case 'dec':m='December';break}if(parseInt(r[1])>0&&parseInt(r[1])<=31){d=parseInt(r[1]);}if(r[2].length===2){var now=new Date();y=parseInt(now.getFullYear()/100)*100+parseInt(r[2]);if(y>now.getFullYear()){y-=100}}else if(r[2].length===4){y=parseInt(r[2]);}return(m?(m+' '):'')+(d?(d+', '):'')+(y?y:'')}