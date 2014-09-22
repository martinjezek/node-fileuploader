'use strict';

var $uploadList = $('#upload-list');
var uploadItemTemplate = Handlebars.compile($('#uploadItem').html());

$('form').on('submit', function() {
    $.ajax({
        url: '/',
        type: 'POST',
        data: new FormData(this),
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        cache: false,
        success: function(file) {
            if (file.path !== null) {
                // render uploaded item
                var $uploadItem = $(uploadItemTemplate(file));
                $uploadList.prepend($uploadItem);
                // reset form inputs
                $('#name').val('');
                $('#file').val('');
            }
        }
    });
    return false;
});
