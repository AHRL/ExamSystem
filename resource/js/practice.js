import '../scss/practice.scss'
import { EventEmitter } from 'eventemitter3'
const emitter = new EventEmitter()

class Practice {
    constructor() {
        this.data = null
        this.current = null
        this.index = 0
        this.answer = [] // [{ans: '123123'}]

        this.dom = {
            examLang: $('.exam-lang'),
            examType: $('.exam-type'),
            currentNum: $('.current-num'),
            totalNum: $('.total-num'),
            des: $('.exam-des'),
            form: null,
            btns: $('.btn-group'),
            examUl: $('.exam-items')
        }
    }

    init() {
        this.getData()
        emitter.on('getData', (data) => {
            if (data.ret && data.data) {
                this.data = data
                this.current = data.data[0]
                console.log(this.current)
                this.switchType()
                this.updateHeader()
                this.createMain()
                this.createFooter()

                this.hideLoading()
                this.clickBtns()
                this.clickItem()
            }
        })
    }

    getData() {
        this.showLoading()
        $.get('api/back')
            .done(data => {
                console.log(data)
                emitter.emit('getData', JSON.parse(data))
            })
    }

    showLoading() {}

    hideLoading() {}

    switchType() {
        let data = this.data.data
        let len = data.length
        for (let i = 0; i < len; i++) {
            let type = data[i].type
            switch(type) {
                case 'radio':
                    data[i].type = '单选'
                    break
                case 'checkbox':
                    data[i].type = '多选'
                    break
                default:
                    data[i].type = '简答'
                    break
            }
        }
    }

    updateHeader() {
        let index = this.index
        this.dom.examLang.text(this.current.lang)
        this.dom.examType.text(this.current.type)
        this.dom.currentNum.text(index + 1)
        this.dom.totalNum.text(this.data.data.length)
    }

    createMain() {
        this.dom.form = $('<form>').addClass('exam-form')
        if (this.current.type === '单选') {
            this.createChoice('radio')
        } else if (this.current.type === '多选') {
            this.createChoice('checkbox')
        } else {
            this.createDefault()
        }
        this.dom.des.text(this.current.description)
    }

    createChoice(type) {
        for (let i = 0; i < 4; i++) {
            let input = $('<input>').addClass('custom-control-input')
                .attr({
                    type: type,
                    name: `exam-${type}`,
                    id: `exam-${type}-${i}`
                })
            let label = $('<label>').addClass('custom-control-label')
                .attr('for', `exam-${type}-${i}`)
                .text(this.current.content[i])
            let wrapper = $('<div>').addClass(`custom-control custom-${type}`)
                .append(input, label)
            this.dom.form.append(wrapper)
        }
        this.dom.des.after(this.dom.form)
    }

    createDefault() {
        let textarea = $('<textarea>').attr({
            col: 100,
            row: 20
        })
        this.dom.form.append(textarea)
        this.dom.des.after(this.dom.form)
    }

    updateMain() {
        this.dom.form.remove()
        this.current = this.data.data[this.index]
        this.createMain()
    }

    createFooter() {
        const dataList = this.data.data
        let itemFragment = document.createDocumentFragment()
        for (let i = 0, len = dataList.length; i < len; i++) {
            let li = document.createElement('li')
            li.innerHTML = i + 1
            li.classList = 'exam-item'
            if (i === 0) {
                li.classList += ' answering'
            }
            itemFragment.appendChild(li)
        }
        this.dom.examUl[0].appendChild(itemFragment)
    }

    updateFooter(target) {
        let children = this.dom.examUl.children().toArray()
        let $target = (typeof target === 'number') ? $(children[target]) : $(target)
        children.forEach(child => {
            if ($(child).hasClass('answering')) {
                $(child).removeClass('answering')
            }
        })
        $target.addClass('answering')
    }

    clickBtns() {
        this.dom.btns.on('click', e => {
            let target = e.target
            $(target).hasClass('btn-next') ? this.handleNext() : this.handleAhead()
        })
    }

    clickItem() {
        this.dom.examUl.on('click', e => {
            let target = e.target
            let len = this.data.data.length
            this.save()
            this.index = $(target).index()
            this.current = this.data.data[this.index]
            this.updateHeader()
            this.updateMain()
            this.recover()
            this.updateFooter(target)
            if (this.index === len - 1) {
                this.dom.btns.find('.btn-next').text('完成练习')
            } else {
                this.dom.btns.find('.btn-next').text('下一题')
            }
        })
    }

    handleNext() {
        let len = this.data.data.length
        if (this.index < len - 1) {
            this.save()
            this.current = this.data.data[++this.index]
            this.updateHeader()
            this.updateMain()
            this.recover()
            this.updateFooter(this.index)
            if (this.index === len - 1) {
                this.dom.btns.find('.btn-next').text('完成练习')
            } else {
                this.dom.btns.find('.btn-next').text('下一题')
            }
        } else {
            this.index = len - 1
            this.submit()
        }
    }

    handleAhead() {}

    save() {
        let form = this.dom.form
        let inputs = form.find('input').toArray()
        let cur_answer = {
            ans: '',
            seq: this.index,
            type: this.current.type
        }
        if (inputs.length) {
            inputs.forEach((ipt, i) => {
                if (ipt.checked) {
                    cur_answer.ans += i
                }
            })
        } else {
            cur_answer.ans = form.find('textarea').val()
        }
        if (cur_answer.ans) { // 是否选择了答案
            if (!this.answer[this.index]) { // 没保存过答案
                this.answer.push(cur_answer) // 执行保存
            } else {
                if (this.answer[this.index].ans !== cur_answer.ans) { // 用于修改过答案
                    this.answer[this.index].ans = cur_answer.ans
                }
            }
        }
    }

    recover() {
        let index = this.index
        let ans
        if (this.answer[index]) {
            ans = this.answer[index].ans
        }
        if (ans) {
            let inputs = this.dom.form.find('input').toArray()
            if (inputs.length) {
                let ansarr = ans.split('')
                let len = ansarr.length
                for (let i = 0; i < len; i++) {
                    inputs.forEach((ipt, idx) => {
                        if (ansarr[i] == idx) {
                            ipt.checked = true
                        }
                    })
                }
            } else {
                this.dom.form.find('textarea').val(ans)
            }
        }
    }

    submit() {
        this.save()
        this.handleAnswer()
        alert('完成')
    }

    handleAnswer() {
        let answers = this.answer.map(answer => {
            if (answer.type !== '简答') {
                return answer.ans.split('').map(ans => {
                    return String.fromCharCode(65 + parseInt(ans))
                }).join('')
            } else {
                return answer.ans
            }
        })
        $.post('/api/exam_submit', `paperAnswer=${JSON.stringify(answers)}`)
            .done(data => {
                if (data.ret) {
                    location.href = './personal.html'
                }
            })
    }
}

$(() => {
    const practice = new Practice()
    practice.init()
})