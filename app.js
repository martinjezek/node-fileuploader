'use strict';

var root = __dirname;

var http = require('http');
var formidable = require('formidable');
var socketio = require('socket.io');

var fileserver = require('./app/fileserver.js');

var upload = function(req, res) {
    if (isFormData(req)) {
        var form = new formidable.IncomingForm();

        form.on('progress', function(bytesRecieved, bytesExpected) {
            var percent = Math.floor(bytesRecieved / bytesExpected * 100);
            console.log(percent);
        });

        form.parse(req, function(err, fields, files) {
            console.log(fields);
            console.log(files);
            res.end('Upload Complete');
        });
    } else {
        fileserver.showError(res, 400, 'Bad Request: expecting multipart/form-data');
    }
};

var isFormData = function(req) {
    var type = req.headers['content-type'] || '';
    return 0 === type.indexOf('multipart/form-data');
};

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'GET':
            fileserver.streamFile(req, res, root);
            break;
        case 'POST':
            upload(req, res);
            break;
    }

}).listen(3000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:3000/');
