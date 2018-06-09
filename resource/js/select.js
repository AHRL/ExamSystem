import '../scss/select.scss'
import { EventEmitter } from 'eventemitter3'
const emitter = new EventEmitter()

class Select {
    constructor(){
        this.dom = {
            form: $('.choice-form'),
            choiceBox: $('.choosed'),
            submit: $('.btn-submit')
        }

        this.data = {
            choice: [],
            query: {
                lang: [],
                type: [],
                num: []
            },
            q: ''
        }
    }

    init() {
        this.handleInputChange()
        emitter.on('inputChange', (data) => {
            let result = data.join(' | ')
            this.dom.choiceBox.text(result)
            this.data.choice = []
        })
        this.submit()
    }

    handleInputChange() {
        this.dom.form.on('change', e => {
            e.preventDefault()
            this.dom.form.find('input').toArray().forEach(input => {
                if (input.checked) {
                    this.data.choice.push($(input).next('label').text())
                }
            })
            emitter.emit('inputChange', this.data.choice)
        })
    }

    submit() {
        this.dom.submit.on('click', e => {
            e.preventDefault()
            this.handleQuery()
            $.get('/api/select', this.data.q)
                .done(data => {
                    if (JSON.parse(data).ret) {
                        location.href = './practice.html'
                    }
                })
        })
    }

    handleQuery() {
        this.dom.form.find('input[name="lang"]').toArray().forEach(input => {
            if (input.checked) {
                this.data.query.lang.push($(input).next('label').text())
            }
        })
        this.dom.form.find('input[name="type"]').toArray().forEach(input => {
            if (input.checked) {
                this.data.query.type.push($(input).next('label').text())
            }
        })
        this.dom.form.find('input[name="num"]').toArray().forEach(input => {
            if (input.checked) {
                this.data.query.num.push($(input).next('label').text())
            }
        })
        this.data.q = 'lang=' + this.data.query.lang.join('|') + '&&' +
            'type=' + this.data.query.type.join('|') + '&&' +
            'num=' + this.data.query.num.toString()
    }
}

$(() => {
    const select = new Select()
    select.init()
})