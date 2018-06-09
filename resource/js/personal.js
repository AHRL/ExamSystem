$(document).ready(pageReady);

var server = 'http://127.0.0.1:3000';

function pageReady() {
    $.ajax({
        type: 'GET',
        url: server + '/api/userinfo',
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
            url: server + '/api/logout'
        });
    });

    var $listGroup = $('.list-group');
    var $listBox = $('.listBox');

    $listBox.toArray().forEach(function(box, item) {
        if (item !== 0) {
            $(box).hide();
        }
    });

    $listGroup.on('click', function(e) {
        var $target = $(e.target);
        var index = $target.index();

        var children = $listGroup.children().toArray();
        if (index === 1 || index === 2) {
            return;
        } else {
            children.forEach(function(child) {
                if ($(child).hasClass('active')) {
                    $(child).removeClass('active');
                }
            });
            $target.addClass('active');
            if (index === 0 || index === 3) {
                $listBox.toArray().forEach(function(box) {
                    $(box).hide();
                });
                $($listBox.toArray()[index]).show();
            } else {
                return;
            }
        }
    });

    var $tabGroup1 = $('.tabGroup1');
    var tabCon1 = $('.tabCon1').toArray();

    tabCon1.forEach(function(con, index) {
        if (index !== 0) {
            $(con).hide();
        }
    });

    $tabGroup1.on('click', function(e) {
        var $target = $(e.target);
        var index = $target.index();
        var children = $tabGroup1.children().toArray().map(function(child) {
            return $(child).children();
        });
        console.log(children);
        children.forEach(function(child) {
            if ($(child).hasClass('active')) {
                $(child).removeClass('active');
            }
        });
        $target.addClass('active');
        $(tabCon1[index]).show();
    });

}