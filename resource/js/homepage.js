$(document).ready(pageReady);

var server = ''

function pageReady() {
    // Page home ---------------------------
    var $avator = $('#avator');
    $.ajax({
        type: 'GET',
        url: server + '/api/userinfo',
        dataType: 'json',
        success: function(data) {
            data = JSON.parse(data);
            if (data.name) {
                $avator.text(data.name);
            } else {
                $avator.text('游客');
            }
        }
    });

    var $logout = $('#logout');
    $logout.on('click', function() {
        $.ajax({
            type: 'GET',
            url: server + '/logout',
            success: function(data) {

            },
            error: function(err) {
                console.error(err);
            }
        });
    });

    var $examListForSign = $('#examListForSign');
    var $firstChild = $($examListForSign[0].firstElementChild);
    $.ajax({
        type: 'GET',
        url: server + '/api/exam-list-for-sign',
        dataType: 'json',
        success: function(data) {
            if (data) {
                data = JSON.parse(data); // 期望 JSON 数组
                $firstChild.text('');
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    createCard(data[i]);
                }

            } else {
                $firstChild.text('暂无考试');
            }
        },
        error: function(err) {
            console.error(err);
        }
    });

    function createCard(data) {
        var $title = $('<h4>').addClass('card-title').text(data.name);
        var textArr = [
            $('<p>').addClass('card-text').text('考试时间：' + data.date),
            $('<p>').addClass('card-text').text('报名截止：' + data.deadline),
            $('<p>').addClass('card-text').text('考试地点：' + data.loc)
        ];
        var $btn = $('<button>').addClass('btn btn-sm btn-primary').attr('type', 'button').text('点击报名');
        $btn.on('click', function(e) {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: server + '/api/user-sign-for-exam',
                data: JSON.stringify({
                    "id": data.id
                }),
                dataType: 'json',
                contentType: 'application/json',
                success: function(data) {
                    data = JSON.parse(data);
                    if (data.isSuccess) {
                        $btn.addClass('disabled').attr('disabled', 'disabled').text('已报名');
                    } else {
                        // 报名失败
                    }
                }
            });
        });
        var $bd = $('<div>').addClass('card-body');
        $bd.append($title).append(textArr[0]).append(textArr[1]).append(textArr[2]).append($btn);
        $examListForSign.append(
            $('<div>').addClass('col-4').append(
                $('<div>').addClass('card').width('100%').append($bd)
            )
        );
    }
}