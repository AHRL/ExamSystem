import '../scss/main.scss'

class Home {
    constructor() {
        this.$avator = $('#avator');
        this.$logout = $('#logout');
        this.$examListForSign = $('#examListForSign');
        this.$noExam = this.$examListForSign.find('.no-exam');
    }

    init() {
        this.getUser();
        this.getExamList();
        this.logout();
    }

    getUser() {
        $.get('/api/userinfo')
            .then(data => {
                data = JSON.parse(data);
                const username = data.data.username;
                if (data.ret && username) {
                    this.$avator.text(username);
                } else {
                    this.$avator.text('游客');
                }
            })
            .fail(err => {
                this.$avator.text('游客');
            });
    }

    getExamList() {
        $.get('/api/exam_list_for_sign')
            .then(data => {
                data = JSON.parse(data);
                const res = data.data;
                if (data.ret && res) {
                    this.$noExam.text('');
                    const len = res.length;
                    for (let i = 0; i < len; i++) {
                        this.createCard(res[i]);
                    }
                } else {
                    this.$noExam.text('暂无考试');
                }
            })
            .fail(err => {
                this.$noExam.text('暂无考试');
            });
    }

    logout() {
        this.$logout.on('click', () => {
            // TODO
            $.get('/api/logout')
                .then(data => {
                    alert('您已退出登录')
                    location.assign('/login')
                }).fail(err => { });
        });
    }

    createCard(data) {
        let $title = $('<h4>').addClass('card-title').text(data.name);
        let textArr = [
            $('<p>').addClass('card-text').text('考试时间：' + data.date),
            $('<p>').addClass('card-text').text('报名截止：' + data.deadline),
            $('<p>').addClass('card-text').text('考试地点：' + data.location)
        ];
        let $btn = $('<button>').addClass('btn btn-sm btn-primary').attr('type', 'button').text('点击报名').val(data.token);
        if (data.isSigned) {
            $btn.addClass('disabled')
                .attr('disabled', 'disabled')
                .text('已报名');
        }
        $btn.on('click', e => {
            e.preventDefault();
            $.post('/api/user_sign_for_exam', {
                token: $btn.val()
            }).then(data => {
                data = JSON.parse(data);
                const res = data.data;
                if (data.ret && res.status === 'OK') {
                    $btn.addClass('disabled')
                    .attr('disabled', 'disabled')
                    .text('已报名');
                }
            })
        });
        let $bd = $('<div>').addClass('card-body');
        $bd.append($title).append(textArr[0]).append(textArr[1]).append(textArr[2]).append($btn);
        this.$examListForSign.append(
            $('<div>').addClass('col-4').append(
                $('<div>').addClass('card').width('100%').append($bd)
            )
        );
    }
}

$(document).ready(function() {
    $.ajaxSetup({
        timeout: 2000
    });

    const home = new Home();
    home.init();
});

