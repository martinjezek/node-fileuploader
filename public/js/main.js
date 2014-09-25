'use strict';

var $uploadList = $('#upload-list');
var $progressbar = $('#progress-bar');
var $submit = $('#submit');
var $name = $('#name');
var $file = $('#file');

var uploadItemTemplate = Handlebars.compile($('#uploadItemTemplate').html());
var progressbarTemplate = Handlebars.compile($('#progressbarTemplate').html());

var socket = io.connect();
var uploading = false;

socket.on('ready', function(sid) {
    $('#sid').val(sid);
});

socket.on('progress', function(percent) {
    $progressbar.html(progressbarTemplate(percent));
});

$('form').on('submit', function() {
    if (!uploading) {
        uploading = !uploading;

        $.ajax({
            url: '/',
            type: 'POST',
            data: new FormData(this),
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false,
            timeout: 2*60*60*1000, // 2 hours for big files
            beforeSend: function() {
                $progressbar.html(progressbarTemplate(0));
                $progressbar.addClass('active');
                $submit.addClass('disabled');
            },
            success: function(file) {
                if (file.path !== null) {
                    // render uploaded item
                    var $uploadItem = $(uploadItemTemplate(file));
                    $uploadList.prepend($uploadItem);
                }
            },
            complete: function() {
                // reset form
                $name.val('');
                $file.val('');
                $submit.removeClass('disabled');
                $progressbar.removeClass('active');
                uploading = !uploading;
            }
        });
    }
    return false;
});
