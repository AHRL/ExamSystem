import '../scss/exam-detail.scss'

class Detail {
    constructor() {
        this.$title = $('.h3')
        this.$name = $('.name')
        this.$stuID = $('.stuID')
        this.$major = $('.major')
        this.$questionCh = $('.question-ch')
        this.$papers = $('.papers')
        this.$score = $('.score')
        this.$submit = $('.btn')
    }

    init() {
        this.render()
    }

    render() {
        $.get('/api/')
            .then(data => {})
            .catch(err => {})
    }

    submit() {
        this.$submit.on('click', e => {
            e.preventDefault()
            $.post('/api')
                .then(data => {

                })
                .catch(err => {
                    
                })
        })
    }
}

$(() => {
    const detail = new Detail()
    detail.init()
})