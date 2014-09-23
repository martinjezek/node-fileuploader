'use strict';

var $uploadList = $('#upload-list');
var $progressbar = $('#progress-bar');
var uploadItemTemplate = Handlebars.compile($('#uploadItemTemplate').html());
var progressbarTemplate = Handlebars.compile($('#progressbarTemplate').html());

var socket = io();

$('form').on('submit', function() {
    $.ajax({
        url: '/',
        type: 'POST',
        data: new FormData(this),
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        cache: false,
        beforeSend: function() {
            $progressbar.html(progressbarTemplate(0));
            $progressbar.addClass('active');
        },
        success: function(file) {
            if (file.path !== null) {
                // render uploaded item
                var $uploadItem = $(uploadItemTemplate(file));
                $uploadList.prepend($uploadItem);
                // reset form inputs
                $('#name').val('');
                $('#file').val('');
            }
            // $progressbar.removeClass('active');
        }
    });
    return false;
});
