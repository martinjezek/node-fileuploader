'use strict';

var formidable = require('formidable');
var socketio = require('socket.io');
var fileserver = require('./fileserver.js');

var upload = function(req, res, callback) {
    if (isFormData(req)) {
        var form = new formidable.IncomingForm();

        form.on('progress', function(bytesRecieved, bytesExpected) {
            var percent = Math.floor(bytesRecieved / bytesExpected * 100);
            console.log(percent);
        });

        form.parse(req, function(err, fields, files) {
            if (typeof callback === 'function') {
                callback(fields, files);
            }
        });
    } else {
        fileserver.showError(res, 400, 'Bad Request: expecting multipart/form-data');
    }
};

var isFormData = function(req) {
    var type = req.headers['content-type'] || '';
    return 0 === type.indexOf('multipart/form-data');
};

exports.upload = upload;
