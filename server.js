var FS = require('fs'),
    Path = require('path'),
    Express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    session = require('express-session'),
    timeout = require('connect-timeout');
//config = JSON.parse(FS.readFileSync("./common/config/config.json"));
var app;
http.globalAgent.maxSockets = 2000;

// Variables for hosting the application on HTTPS
var https = require('https');
https.globalAgent.maxSockets = 2000;

// Certificate files
// const privateKey = FS.readFileSync('./common/certi/samltestApp.key', 'utf8');
// const certificate = FS.readFileSync('./common/certi/samltestApp.crt', 'utf8');
// const credentials = {
//     key: privateKey,
//     cert: certificate
// };

//overwrite console.log
oldConsole = {};
oldConsole.log = console.log;

function log() {
    oldConsole.log.apply(console, [new Date()].concat(Array.prototype.slice.call(arguments)));
}
console.log = log;

//Call all initialization functions here
function start() {
    initExpress();
    // startMesgOnWhatsapp();  
}

function startMesgOnWhatsapp() {
    var whatsappService = require('./common/jobs/whatsappJob.js');
    whatsappService.sendMessage()
}

//Set express options and initialize express
function initExpress() {
    var homeDir = Path.normalize(__dirname);
    app = Express();
    app.use(Express.static('public'));
    https.createServer(app, function (req, res) {
    }).listen(8095, function () {
        console.log("Twilio WhatsApp server listening on port 8095 on HTTPS channel");
    });

    app.use(timeout(120000, { "respond": true }));

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.set('trust proxy', 1) // trust first proxy
    app.use(bodyParser.json());

    app.use(haltOnTimedout);
    function haltOnTimedout(err, req, res, next) {
        if (req.timedout === true) {
            res.json({ "code": 500, "msg": "Request Timedout" });
        } else {
            next();
        }
    };

    app.use(function (error, req, res, next) {
        if (!error) {
            next();
        } else {
            console.error(error.stack);
            res.send({ "code": 500, "msg": "Request Cannot be served" });
        }
    });
    //require('./jobs.js')();
    app.use('/internal', require('./internal/appRoutesManager.js'));

}

function stopServer() {
    console.log("shutting down express server ...");
    app.close();
}
process.on('uncaughtException', function (err) {
    console.error('process.onUncaughtException');
    console.error(err);
});
exports.start = start;
//Start execution ..
start();
