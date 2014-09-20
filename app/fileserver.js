'use strict';

var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var streamFile = function(req, res, root) {
    var url = parse(req.url);
    var filePath = getPublicUrl(root, url.pathname, 'index.html');

    fs.stat(filePath, function (err, stat) {
        if (err) {
            if (err.code == 'ENOENT') {
                showError(res, 404, 'File not Found');
            } else {
                showError(res, 500, 'Internal Server Error');
            }
        } else {
            // set correct MIME type header
            res.setHeader('Content-Type', mime.lookup(path.basename(filePath)) + '; charset="utf-8"');
            // stream the file
            var stream = fs.createReadStream(filePath);
            stream.pipe(res);
            stream.on('error', function (err) {
                showError(res, 500, 'Internal Server Error');
            });
        }
    });
};

var getPublicUrl = function(root, filePath, defaultFilePath) {
    if (filePath === '/') {
        filePath += defaultFilePath;
    }
    var publicPath = join(root, '/public/' + filePath.replace(/\.\.\//g, ''));

    return publicPath;
};

var showError = function (res, code, message) {
    res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
    res.setHeader('Content-Length', Buffer.byteLength(message));
    res.statusCode = code;
    res.end(message);
};

exports.streamFile = streamFile;
exports.showError = showError;
