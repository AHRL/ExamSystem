import '../scss/exam_detail.scss'

class Detail {
    constructor() {
        this.$con = $('.container')
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
        $.post('/api/showDetail', `email=${localStorage.getItem('stuEmail')}&id=${localStorage.getItem('id')}`)
            .then(data => {
                data = JSON.parse(data)
                if (data.success) {
                    const res = data.data
                    this.$title.text(res.title)
                    this.$name.text(res.name)
                    this.$stuID.text(res.stuID)
                    this.$major.text(res.major)
                    this.$questionCh.text('选择题得分：' + res.chScore)
                    this.$score.text(res.chScore)
                    this.createQuestion(res.answers)
                    this.score()
                }
            })
            .catch(err => {})
    }

    createQuestion(data) {
        const len = data.length
        for (let i = 0; i < len; i++) {
            let question = $('<div>').addClass('question')
                .append(
                    $('<div>').addClass('q-title').text(data[i].title),
                    $('<textarea>').addClass('form-control').attr({
                        cols: 20,
                        rows: 8,
                        disabled: true
                    }).css({
                        resize: 'none'
                    }).text(data[i].answer),
                    $('<div>').append(
                        $('<input>').addClass('form-control set-score').attr({
                            type: 'text',
                            placeholder: `评分，满分 ${data[i].score} 分`
                        })
                    )
                )
            this.$papers.append(question)
        }
    }

    score() {
        let that = this
        let setScore = $('.set-score').toArray()
        for (let i = 0; i < setScore.length; i++) {
            $(setScore[i]).on('blur', e => {
                let str = that.$questionCh.text()
                let initScore = parseInt(str.slice(6))
                let score = initScore
                for (let j = 0; j < setScore.length; j++) {
                    score += Number($(setScore[j]).val())
                }
                that.$score.text(score)
            })
        }
    }

    submit() {
        this.$submit.on('click', e => {
            e.preventDefault()
            $.post('/api/submitScore', JSON.stringify({
                score: this.$score.text()
            }))
                .then(data => {
                    data = JSON.parse(data)
                    if (data.success) {
                        alert('完成批阅')
                        login.assgin('/admin.html')
                    }
                })
                .catch(err => {})
        })
    }
}

$(() => {
    const detail = new Detail()
    detail.init()
})