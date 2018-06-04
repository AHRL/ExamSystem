import '../scss/admin.scss';

class Admin {
    constructor() {
        this.$navTab = $('.navbar-nav');
        this.$conTab = $('.con-item');
        this.$moreBtn = $('.btn-more');
        this.$moreBlock = $('.more');
        this.$list = $('.list-group');
        this.$listCon = $('.list-con');

        this.$examTitle = $('#chooseTitle');
        this.$examType = $('#chooseType');
        this.$examYear = $('#chooseYear');
        this.$examMonth = $('#chooseMonth');
        this.$examDay = $('#chooseDay');
        this.$examTime = $('#chooseTime');
        this.$examLoc = $('#chooseLoc');
        this.$basicBtn = $('#basicBtn');

        this.$qTitle = $('#questionDesc');
        this.$qType = $('#questionType');
        this.$qScore = $('#questionScore');
        this.$qChoice = $('.questionChoice');
        this.$qBtn = $('.questionBtn');

        this.$examInfo = $('.exam-info');
        this.$submit = $('.btn-submit');

        this.exam = {
            basic: null,
            question: []
        };
    }

    init() {
        this.tab();
        this.getMore();
        this.listTab();
        this.basicBtnClick();
        this.qBtnClick();
        this.submit();
    }

    tab() {
        this.$navTab.on('click', e => {
            e.preventDefault();
            const $target = $(e.target);
            const index = $target.index('.nav-link');
            if (index !== 2) {
                const children = this.$navTab.children().toArray().map(item => {
                    return $(item).children();
                })
                children.forEach(item => {
                    if ($(item).hasClass('active')) {
                        $(item).removeClass('active');
                    }
                });
                $target.addClass('active');
                this.$conTab.toArray().forEach((item, idx) => {
                    $(item).hide();
                    if (index === idx) {
                        $(item).show();
                    }
                })
            }
        });
    }

    getMore() {
        this.$moreBtn.toArray().forEach((item, index) => {
            if (index === 0) {
                $(item).on('click', e => {
                    e.preventDefault();
                    const $target = $(e.target).parent().find('.card-title');
                    const $title = this.$moreBlock.find('.h4');
                    $title.text($target.text());
                    this.$moreBlock.hide();
                    $.get('/api/examed_detail')
                        .done(data => {
                            data = JSON.parse(data);
                            const res = data.data;
                            if (data.ret && res) {
                                const chart = Highcharts.chart('more-content', res);
                            }
                        })
                    this.$moreBlock.show();  
                })
            } else if (index === 1) {
                $(item).on('click', e => {
                    e.preventDefault();
                    const $target = $(e.target).parent().find('.card-title');
                    const $title = this.$moreBlock.find('.h4');
                    $title.text($target.text());
                    this.$moreBlock.hide();
                    $.get('/api/exam_sign_detail')
                        .done(data => {
                            data = JSON.parse(data);
                            const res = data.data;
                            if (data.ret && res) {
                                const chart = Highcharts.chart('more-content', res);
                            }
                        })
                    this.$moreBlock.show();
                })
            } else {
                $(item).on('click', e => {
                    e.preventDefault();
                    const $target = $(e.target).parent().find('.card-title');
                    const $title = this.$moreBlock.find('.h4');
                    $title.text($target.text());
                    this.$moreBlock.hide();
                    $.get('/api/exam_categroy')
                        .done(data => {
                            data = JSON.parse(data);
                            const res = data.data;
                            if (data.ret && res) {
                                const chart = Highcharts.chart('more-content', res);
                            }
                        })
                    this.$moreBlock.show();
                })
            }
        })
    }

    listTab() {
        this.$list.on('click', e => {
            e.preventDefault();
            const $target = $(e.target);
            const index = $target.index();
            this.$list.children().toArray().forEach(item => {
                if ($(item).hasClass('active')) {
                    $(item).removeClass('active');
                }
            });
            $target.addClass('active');
            this.$listCon.toArray().forEach((item, idx) => {
                $(item).hide();
                if (index === idx) {
                    $(item).show();
                }
            })
        })
    }

    basicBtnClick() {
        this.$basicBtn.on('click', e => {
            e.preventDefault();
            this.exam.basic = {
                describe: this.$examTitle.val(),
                type: this.$examType.val(),
                date: `${this.$examYear.val()}/${this.$examMonth.val()}/${this.$examDay.val()}`,
                time: this.$examTime.val(),
                location: this.$examLoc.val()
            }
            const time = this.exam.basic.time;
            const deadline = parseInt(time.slice(0, 2)) - 2 + time.slice(2, 5);
            this.exam.basic.deadline = deadline;
            alert('提交成功');
            this.clear();
        })
    }

    qBtnClick() {
        this.$qBtn.on('click', e => {
            e.preventDefault();
            let type = this.$qType.val();
            if (type === '单选') {
                type = 'radio'
            } else if (type === '多选') {
                type = 'checkbox'
            } else {
                type = 'other';
            }
            this.exam.question.push({
                describe: this.$qTitle.val(),
                type: type,
                score: this.$qScore.val(),
                content: this.$qChoice.toArray().map(item => {
                    return $(item).val();
                })
            });
            console.log(this.exam);
            this.renderExamInfo();
            alert('添加成功');
            this.clear();
        })
    }

    renderExamInfo() {
        let score = 0;
        let len = this.exam.question.length;
        for (let i = 0; i < len; i++) {
            score += parseInt(this.exam.question[i].score);
        }
        let arr = [
            `试卷名称：${this.exam.basic.describe}`,
            `考试时间：${this.exam.basic.date} ${this.exam.basic.time}`,
            `考试地点：${this.exam.basic.location}`,
            `试题数量：${len}`,
            `试题总分：${score}`
        ]
        this.$examInfo.children().toArray().forEach((item, index) => {
            $(item).text(arr[index]);
        });
    }

    clear() {
        $('.qform').find('input').toArray().forEach(item => {
            $(item).val('');
        });
        $('.qform').find('select').toArray().forEach(item => {
            $(item).children().toArray().forEach((item, index) => {
                if ($(item).attr('selected')) {
                    $(item).removeAttr('selected');
                }
                if (index === 0) {
                    $(item).attr('selected', 'true')
                }
            })
        })
    }

    submit() {
        this.$submit.on('click', e => {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/api/exam_add',
                data: JSON.stringify(this.exam),
                contentType: 'application/json'
            })
                .done(data => {
                    data = JSON.parse(data);
                    console.log(data)
                    if (data.ret && data.data.status === 'OK') {
                        alert('提交成功');
                    }
                });
        });
    }
}

$(document).ready(function() {
    const admin = new Admin();
    admin.init();
})