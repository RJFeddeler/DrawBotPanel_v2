var wpi = require('wiringpi-node');
var http = require('http');
var express = require('express');
var fs = require('fs-extra');

var app = express();

wpi.setup('gpio');
wpi.wiringPiSPISetup(0, 2000000);

var EmergencyStopPin    = 25;
var DataRequestPin      = 8;
var andAnotherPin       = 7;

var printerSettings = {
    width: 200,
    height: 250,
    bufferCommands: 20
};

var printSettings = {
    transmitting: false,
    file: null,
    lineCounter: 0,
    orientation: 'portrait',
    scale: 1.0
};

var penSettings = {
    point: 0.5
};

wpi.pinMode(EmergencyStopPin, wpi.OUTPUT);
wpi.digitalWrite(EmergencyStopPin, 0);

wpi.pinMode(DataRequestPin, wpi.INPUT);
wpi.pullUpDnControl(DataRequestPin, wpi.PUD_DOWN);
wpi.wiringPiISR(DataRequestPin, wpi.INT_EDGE_RISING, function(delta) {
    console.log('DataRequestPin: Interrupt!');
    sendMoreROB();
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(80);

app.get('/', function (req, res) {
    console.log("REQUEST: Home");
    res.sendFile(__dirname + '/index.html');
});

app.get('/cmd', function(req, res) {
    console.log("REQUEST: Command");
    res.sendFile(__dirname + '/cmd.html');
});

app.get('/svg', function(req, res) {
    console.log("REQUEST: Command");
    res.sendFile(__dirname + '/svg.html');
});

app.use('/static', express.static('node_modules'));
app.use('/public', express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log("Socket Connected");

    socket.on('command', function (data) {
        if (data.hasOwnProperty('z')) {
            var nums = new Uint16Array([ Math.trunc(Number(data.z) * 1000) ]);
            var packet = new Uint8Array([ 0xFE, 0xDD, 0x04, (nums[0] >> 8), (nums[0] & 0xFF) ]);
        }
    });

    socket.on('request', function(data) {
    });

    socket.on('STOP', () => {
        printSettings.transmitting = false;
        printSettings.file = null;
        printSettings.lineCounter = 0;
        
        wpi.wiringPiSPIDataRW(0, new Uint8Array([ 0xFE, 0xDD, 0xFF ]));
    });

    socket.on('renameROB', function(file) {
        if (file.hasOwnProperty('old') && file.hasOwnProperty('new')) {
            try {
                fs.moveSync('public/art/' + file.old, 'public/art/' + file.new);
            } catch (err) {
                console.log(err);
            }
        }
    });

    socket.on('copyROB', function(file) {
        if (file.hasOwnProperty('old') && file.hasOwnProperty('new')) {
            try {
                fs.copySync('public/art/' + file.old, 'public/art/' + file.new);
            } catch (err) {
                console.error(err);
            }
        }
    });

    socket.on('deleteROB', function(file) {
        if (file.hasOwnProperty('filename')) {
            try {
                fs.removeSync('public/art/' + file.filename);
            } catch (err) {
                console.log(err);
            }
        }
    });

    socket.on('drawROB', function(file) {
        if (file.hasOwnProperty('filename')) {
            console.log('drawROB: ' + file.filename);

            fs.readFile('public/art/' + file.filename, 'utf8', (err, data) => {
                if (err) throw err;

                console.log('drawROB: File Loaded!');

                printSettings.file = data.split(/[\r\n]+/g);
                printSettings.lineCounter = 0;
                printSettings.scale = 1.0;
                printSettings.transmitting = true;

                var homeAxesPacket = new Uint8Array([ 0xFE, 0xDD, 0x10 ]);
                wpi.wiringPiSPIDataRW(0, homeAxesPacket);

                if (wpi.digitalRead(DataRequestPin) === wpi.HIGH)
                    sendMoreROB();
            });
        }
    });
});

function sendMoreROB() {
    while (printSettings.transmitting && wpi.digitalRead(DataRequestPin) === wpi.HIGH) {
        if (printSettings.lineCounter >= printSettings.file.length) {
            console.log('sendMoreROB() - File Complete!');
            printSettings.transmitting = false;
            var packet = new Uint8Array([ 0xFE, 0xDD, 0xFF ]);
        }
        else {
            let line = printSettings.file[printSettings.lineCounter++].trim().split(/[\s,]+/g);

            switch (line[0].toUpperCase()) {
                case 'D':
                    if (line.length !== 3)
                        break;

                    /*
                    if (Math.abs(printerSettings.width - Number(line[1])) <= (Math.abs(printerSettings.height - Number(line[2]))))
                        printSettings.scale = printerSettings.width / Number(line[1]);
                    else
                        printSettings.scale = printerSettings.height / Number(line[2]);
                    */

                    break;

                case 'M0':
                case 'M1':
                    if (line.length !== 3)
                        break;

                    var nums = new Uint32Array([ Math.trunc(Number(line[1]) * printSettings.scale * 100), Math.trunc(Number(line[2]) * printSettings.scale * 100) ]);
                    var packet = new Uint8Array([ 0xFE, 0xDD, (line[0].toUpperCase() === 'M1' ? 0x02 : 0x01), (nums[0] >> 24), ((nums[0] >> 16) & 0xFF), ((nums[0] >> 8) & 0xFF), (nums[0] & 0xFF), (nums[1] >> 24), ((nums[1] >> 16) & 0xFF), ((nums[1] >> 8) & 0xFF), (nums[1] & 0xFF) ]);

                    break;

                case 'Z0':
                case 'Z1':
                    if (line.length !== 2)
                        break;
                    
                    var nums = new Uint16Array([ Math.trunc(Number(line[1]) * 1000) ]);
                    var packet = new Uint8Array([ 0xFE, 0xDD, (line[0].toUpperCase() === 'Z1' ? 0x08 : 0x04), (nums[0] >> 8), (nums[0] & 0xFF) ]);

                    break;

                default:
                    break;
            }
        }

        if (packet) {
            console.log(packet);
            wpi.wiringPiSPIDataRW(0, packet);
        }
    }

    if (!printSettings.transmitting)
        console.log('sendMoreROB() - transmitting: false');
    if (wpi.digitalRead(DataRequestPin) !== wpi.HIGH)
        console.log('sendMoreROB() - DataRequestPin: LOW');
};

function emergencyStop() {
    wpi.digitalWrite(EmergencyStopPin, 1);
    wpi.delay(1000);
    wpi.digitalWrite(EmergencyStopPin, 0);
};

function readDir(dirname) {
    var fileList = [];

    fs.readdir('/public/' + dirname + '/', (err, files) => {
        if (err)
            return [];

        files.forEach((filename) => {
            fs.readFile(dirname + filename, 'utf-8', (err, content) => {
                if (err)
                    return;

                fileList.push( readROBHeader(filename, content) );
            });
        });
    });

    return fileList;
};

function readROBHeader(filename, content) {
    console.log(filename);
};
