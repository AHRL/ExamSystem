$(document).ready(pageReady);

function pageReady() {
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:3000/api/userinfo',
        dataType: 'json',
        success: function(data) {
            data = JSON.parse(data);
            if (data.name) {

            } else {

            }
            if (data.isAdmin) {

            } else {

            }
        }
    });

    var $logout = $('#logout');
    $logout.on('click', function() {
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:3000/api/logout'
        });
    });

    var $listGroup = $('.list-group');
    $listGroup.on('click', function(e) {
        var target = $(e.target);
        console.log(target);
    });
}