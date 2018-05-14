$(document).ready(pageReady);

function pageReady() {
    const $avator = $('#avator');
    $.get('/api/userinfo')
        .then(data => {
            data = JSON.parse(data);
            const res = data.data;
            if (data.ret && res) {
                $avator.text(res.username);
                if (res.isAdmin === 'admin') {
                    $('#isAdmin').show();
                }
            }
        })
        .fail(err => {
            console.error(err);
        });

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