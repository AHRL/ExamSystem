$(document).ready(pageReady);

function pageReady() {
    const $avator = $('#avator');
    $.get('/api/userinfo')
        .then(data => {
            console.log(data);
            data = JSON.parse(data);
            console.log(data);
            const res = data.data;
            if (data.ret && res) {
                $avator.text(res.username);
                $('#avator-title').text(`${res.username}，您好！`);
                $('#trueName').val(res.username);
                if (res.isAdmin === 'admin') {
                    $('#isAdmin').show();
                }
            }
        })
        .fail(err => {
            console.error(err);
        });

    $.get('/api/exam_detail')
        .then(data => {
            data = JSON.parse(data);
            const res = data.data;
            if (data.ret && res) {
                let len = res.examing.length;
                if (len === 0) {
                    $('#examingDetail').text('您没有报名考试');
                }
                for (let i = 0; i < len; i++) {
                    createCard(res.examing[i]);
                }
                let len2 = res.examed.length;
                if (len2 === 0) {
                    $('.no-examedDetail').show();
                }
                for (let i = 0; i < len; i++) {
                    createTable(res.examed[i]);
                }
            }
        });

    function createCard(data) {
        let $title = $('<h4>').addClass('card-title').text(data.name);
        let textArr = [
            $('<p>').addClass('card-text').text('考试时间：' + data.date),
            $('<p>').addClass('card-text').text('报名截止：' + data.deadline),
            $('<p>').addClass('card-text').text('考试地点：' + data.location)
        ];
        let $btn = $('<button>').addClass('btn btn-sm btn-primary').attr('type', 'button').text('开始考试');
        $btn.on('click', e => {
            $.get('/api/ready_exam')
                .then(data => {
                    data = JSON.parse(data);
                    const res = data.data;
                    if (data.ret && res.status === 'OK') {
                        // TODO
                        location.assign('http://localhost:8080/exam.html');
                    } else {
                        alert('还没到考试时间');
                    }
            })
        });
        let $bd = $('<div>').addClass('card-body');
        $bd.append($title).append(textArr[0]).append(textArr[1]).append(textArr[2]).append($btn);
        $('#examingDetail').append(
            $('<div>').addClass('col-4').append(
                $('<div>').addClass('card').width('100%').append($bd)
            )
        );
    }

    function createTable(data) {
        let children = [
            $('<td>').attr('scope', 'row').text(data.date),
            $('<td>').text(data.name),
            $('<td>').text(data.score)
        ];
        $('.no-examedDetail').hide();
        let $tr = $('<tr>');
        for (let i = 0; i < 3; i++) {
            $tr.append(children[i]);
        }
        $('#examedDetail').append($tr);
    }

    const $listGroup = $('.list-group');
    const $listBox = $('.listBox');
    $listGroup.on('click', e => {
        let $target = $(e.target);
        let index = $target.index();

        let children = $listGroup.children().toArray();
        children.forEach((item, idx) => {
            if ($(item).hasClass('active')) {
                $(item).removeClass('active');
            }
            if (index === idx) {
                $(item).addClass('active');
            }
        });
        $listBox.toArray().forEach((item, idx) => {
            $(item).hide();
            if (index === idx) {
                $(item).show();
            }
        })
    });

    const $logout = $('#logout');
    $logout.on('click', () => {});

    const $tabGroup1 = $('.tabGroup1');
    const $tabCon1 = $('.tabCon1');

    $tabGroup1.on('click', (e) => {
        let $target = $(e.target);
        let index = $target.index('.tabGroup1 .nav-link');
        let children = $tabGroup1.children().toArray().map((child) => {
            return $(child).children();
        });
        children.forEach((child, idx) => {
            if ($(child).hasClass('active')) {
                $(child).removeClass('active');
            }
            if (index === idx) {
                $(child).addClass('active');
            }
        });
        
        $tabCon1.toArray().forEach((item, idx) => {
            $(item).hide();
            if (index === idx) {
                $(item).show();
            }
        })
    });

    const $tabGroup2 = $('.tabGroup2');
    const $tabCon2 = $('.tabCon2');
    $tabGroup2.on('click', e => {
        let $target = $(e.target);
        let index = $target.index('.tabGroup2 .nav-link');
        let children = $tabGroup2.children().toArray().map((child) => {
            return $(child).children();
        });
        children.forEach((child, idx) => {
            if ($(child).hasClass('active')) {
                $(child).removeClass('active');
            }
            if (index === idx) {
                $(child).addClass('active');
            }
        });
        
        $tabCon2.toArray().forEach((item, idx) => {
            $(item).hide();
            if (index === idx) {
                $(item).show();
            }
        })
    })
}