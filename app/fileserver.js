'use strict';

var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var streamFile = function(req, res, root) {
    var url = parse(req.url);
    var path = getPublicUrl(root, url.pathname, 'index.html');

    fs.stat(path, function (err, stat) {
        if (err) {
            if (err.code == 'ENOENT') {
                showError(res, 404, 'File not Found');
            } else {
                showError(res, 500, 'Internal Server Error');
            }
        } else {
            var stream = fs.createReadStream(path);
            stream.pipe(res);
            stream.on('error', function (err) {
                showError(res, 500, 'Internal Server Error');
            });
        }
    });
};

var getPublicUrl = function(root, path, defaultPath) {
    if (path === '/') {
        path += defaultPath;
    }
    var publicPath = join(root, '/public/' + path.replace(/\.\.\//g, ''));

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
