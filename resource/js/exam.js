import '../scss/exam.scss'

class Exam {
    constructor() {
        this.$type = $('.hzone-type');
        this.$time = $('.hzone-time');
        this.$content = $('.content');
        this.$form = $('<form>').addClass('exam-form');
        this.$describe = $('.content-describe');
        this.$submitAhead = $('<button>').addClass('btn btn-danger btn-sm btn-ahead').attr({
            'data-toggle': 'modal',
            'data-target': '#submitAlert'
        }).text('提前交卷');
        this.$next = $('<button>').addClass('btn btn-primary btn-sm btn-next').text('下一题');
        this.$items = $('<ul>').addClass('answer-items');
        this.$confirmSubmit = $('#confirmSubmit');

        this.current = 0;
        this.result = [];
    }

    init() {
        this.renderInit();
        this.nextItem();
        this.aheadSubmit();
        this.itemNav();
        this.submit();
    }

    renderInit() {
        $.get('/api/exam')
            .then(data => {
                const str = data;
                console.log(str);
                console.log(typeof str);
                data = JSON.parse(str.toString());
                console.log(data.ret)
                const res = data.data;
                if (data.ret && res) {
                    //this.$time.text(data.time);
                    if (res[0].type === 'radio') {
                        this.$type.text('单选');
                    }
                    this.describeInit(res[0].describe);
                    this.contentInit(res[0].type, res[0].content);
                    this.btnInit();
                    this.itemsInit(res.length);
                    localStorage.setItem('exam', JSON.stringify(res));
                }
            })
            .then(() => {
                
            })
    }

    contentInit(type, content) {
        switch(type) {
            case 'radio':
                this.radioInit(content);
                this.$content.append(this.$form);
                break;
            case 'checkbox':
                this.checkboxInit(content);
                this.$content.append(this.$form);
                break;
            default:
                this.defaultInit(content);
                break;
        }
    }

    itemsInit(count) {
        for(let i = 0; i < count; i++) {
            if (i === 0) {
                this.$items.append($('<li>').addClass('answer-item active').text(i+1));
            } else {
                this.$items.append($('<li>').addClass('answer-item').text(i+1));
            }
        }
        $('.answer-card').append(this.$items);
    }

    btnInit() {
        this.$form.append(
            $('<div>').addClass('text-right').append(this.$submitAhead, this.$next)
        )
    }

    radioInit(content) {
        for (let i = 0, len = content.length; i < len; i++) {
            this.$form.append($('<div>').addClass('custom-control custom-radio content-box')
                .append(
                    $('<input>').addClass('custom-control-input')
                        .attr({
                            type: 'radio',
                            name: 'exam-radio',
                            id: `exam-radio${i}`
                        }),
                    $('<label>').addClass('custom-control-label')
                        .attr('for', `exam-radio${i}`)
                        .text(content[i])
                ));
        }
    }

    checkboxInit(content) {
        for (let i = 0, len = content.length; i < len; i++) {
            this.$form.append($('<div>').addClass('custom-control custom-checkbox content-box')
                .append(
                    $('<input>').addClass('custom-control-input')
                        .attr({
                            type: 'checkbox',
                            name: 'exam-checkbox',
                            id: `exam-checkbox${i}`
                        }),
                    $('<label>').addClass('custom-control-label')
                        .attr('for', `exam-checkbox${i}`)
                        .text(content[i])
                ));
        }
    }

    defaultInit() {
        this.$form.append($('<textarea col="50" raw="20">').addClass('content-box'));
    }

    describeInit(content) {
        $('.content-describe').text(content);
    }

    nextItem() {
        this.$next.on('click', e => {
            e.preventDefault();
            this.save();
            const current = ++this.current;
            const res = JSON.parse(localStorage.getItem('exam'));
            const len = res.length;
            if (current < res.length) {
                if (current === res.length - 1) {
                    this.$next.text('完成并交卷');
                }
                let type = res[current].type;
                if (type === 'radio') {
                    this.$type.text('单选');
                } else if (type === 'checkbox') {
                    this.$type.text('多选');
                } else {
                    this.$type.text('简答');
                }
                this.$describe.text(res[current].describe);
                this.replaceContent(res[current].type, res[current].content);

                this.$items.children().toArray().forEach((item, index) => {
                    if ($(item).hasClass('active')) {
                        $(item).removeClass('active');
                    }
                    if (index === current) {
                        $(item).addClass('active');
                    }
                })
            } else {
                this.$next.attr({
                    'data-toggle': 'modal',
                    'data-target': '#submitAlert'
                });
                this.isComplete();
            }
        })
    }

    replaceContent(type, content) {
        this.$form.find('div.content-box').remove();
        switch(type) {
            case 'radio':
                this.replaceRadio(content);
                break;
            case 'checkbox':
                this.replaceCheckbox(content);
                break;
            default:
                this.replaceDefault(content);
                break;
        }
    }

    replaceRadio(content) {
        const len = content.length;
        for (let i = len - 1; i >= 0; i--) {
            this.$form.prepend($('<div>').addClass('custom-control custom-radio content-box')
                .append(
                    $('<input>').addClass('custom-control-input')
                        .attr({
                            type: 'radio',
                            name: 'exam-radio',
                            id: `exam-radio${i}`
                        }),
                    $('<label>').addClass('custom-control-label')
                        .attr('for', `exam-radio${i}`)
                        .text(content[i])
                ));
        }
    }

    replaceCheckbox(content) {
        const len = content.length;
        for (let i = len - 1; i >= 0; i--) {
            this.$form.prepend($('<div>').addClass('custom-control custom-checkbox content-box')
                .append(
                    $('<input>').addClass('custom-control-input')
                        .attr({
                            type: 'checkbox',
                            name: 'exam-checkbox',
                            id: `exam-checkbox${i}`
                        }),
                    $('<label>').addClass('custom-control-label')
                        .attr('for', `exam-checkbox${i}`)
                        .text(content[i])
                ));
        }
    }

    replaceDefault(content) {
        this.$form.prepend($('<div>').addClass('content-box').append($('<textarea>')));
    }

    aheadSubmit() {
        this.$submitAhead.on('click', e => {
            e.preventDefault();
            this.isComplete();
        })
    }

    itemNav() {
        this.$items.on('click', e => {
            this.save();
            let $target = $(e.target);
            let index = $target.index();
            this.$items.children().toArray().forEach(item => {
                if ($(item).hasClass('active')) {
                    $(item).removeClass('active');
                }
            });
            $target.addClass('active');

            this.current = index;
            const res = JSON.parse(localStorage.getItem('exam'));
            const len = res.length;
            if (index === res.length - 1) {
                this.$next.text('完成并交卷');
            } else {
                this.$next.text('下一题');
            }
            this.$describe.text(res[index].describe);
            this.replaceContent(res[index].type, res[index].content);
            this.recover();
        })
    }

    save() {
        let $input = $('.content-box').find('input');
        let $textarea = $('.content-box').find('textarea');
        let $target;
        let ques = '';
        let keyCode = 65;

        if ($input.length) {
            $target = $input;
            $target.toArray().forEach(item => {
                if (item.checked) {
                    ques += String.fromCharCode(keyCode);
                }
                keyCode++;
            });
        } else {
            $target = $textarea;
            ques = $textarea.val();
        }

        if (ques) {
            $(this.$items.children().toArray()[this.current]).addClass('answered');
        }
        this.result.splice(this.current, 1, ques);
    }

    recover() {
        let $input = $('.content-box').find('input');
        let $textarea = $('.content-box').find('textarea');
        let $target;

        let ques = this.result[this.current];
        let keyCode = '';
        let start = 65;
        
        if (ques) {
            if ($input.length) {
                $target = $input;
                keyCode = ques.split('').map(item => {
                    return item.charCodeAt(0);
                });
                for (let i = 0, len = $target.length; i < len; i++) {
                    for (let j = 0, length = keyCode.length; j < length; j++) {
                        if (start === keyCode[j]) {
                            $target.toArray()[i].checked = true;
                        }
                    }
                    start++;
                }
            } else {
                $target = $textarea;
                $textarea.val(ques);
            }
        }
    }

    isComplete() {
        let len = this.result.length;
        let isComplete;
        if (len) {
            isComplete = this.result.every(item => {
                return item == '' ? false : true;
            });
        }
        if (isComplete) {
            $('.modal-body').text('你已完成本次考试，确定提交？');
            $('.modal-footer .btn-danger').text('确定提交');
            $('.modal-footer .btn-primary').text('检查一下');
        } else {
            $('.modal-body').text('你还未完成本次考试，是否提交？');
            $('.modal-footer .btn-danger').text('确定提交');
            $('.modal-footer .btn-primary').text('继续做题');
        }
    }

    submit() {
        this.$confirmSubmit.on('click', e => {
            e.preventDefault();
            $.post('/api/exam_submit', JSON.stringify(this.result))
                .then(data => {
                    data = JSON.parse(data);
                    const res = data.data;
                    if (data.ret && res) {
                        $('#submitAlert').modal('hide');
                        // TODO 跳转到 personal.html
                        location.assign('http://localhost:8080/personal.html');
                    }
                })
        })
    }
}

$(document).ready(function() {
    const exam = new Exam();
    exam.init();
});