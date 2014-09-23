'use strict';

var root = __dirname;
var port = (process.env.USER == 'root' ? 80 : 3000);

var http = require('http');
var fs = require('fs');
var fileserver = require('./app/fileserver.js');
var fileuploader = require('./app/fileuploader.js');

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'GET':
            fileserver.streamFile(req, res, root);
            break;
        case 'POST':
            fileuploader.upload(req, res, function(fields, files) {
                res.setHeader('Content-Type', 'application/json; charset="utf-8"');
                if (files.file.size > 0) {
                    if (fields.name !== undefined && fields.name !== '') {
                        var extension = files.file.name.match(/.*\.(.*)$/);
                        files.file.name = fields.name + '.' + extension[1];
                    }
                    var publicPath = '/upload/' + files.file.name;
                    var newPath = root + '/public' + publicPath;
                    // move file to a new path
                    fs.rename(files.file.path, newPath);
                    // return file info as a response
                    files.file.path = publicPath;
                    res.end(JSON.stringify(files.file));
                } else {
                    res.end(JSON.stringify({
                        path: null
                    }));
                }
            });
            break;
    }

}).listen(port);

console.log('Server running at http://127.0.0.1:' + port + '/');
