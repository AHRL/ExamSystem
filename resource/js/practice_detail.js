import '../scss/practice_detail.scss'

class PracticeDetail {
    constructor() {
        this.$name = $('.name')
        this.$time = $('.time')
        this.$rightRate = $('.right-rate')
        this.$papers = $('.papers')
    }

    init() {
        this.render()
        $('.btn').click(e => {
            e.preventDefault()
            
        })
    }

    render() {
        // $.post('/api/practiceDetail', `username=${localStorage.getItem('prName')}`)
        //     .then(res => {
        //         res = JSON.parse(res)
        //         const data = res.data
        //         if (res.success) {
        //             const date = new Date()
        //             this.$name.text(`姓名：${data.name}`)
        //             this.$time.text(`时间：${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
        //             const pr = data.data
        //             let rightCount = 0
        //             pr.forEach(item => {
        //                 if (item.right) {
        //                     rightCount++
        //                 }
        //             })
        //             this.$rightRate.text(`正确率：${rightCount}/${pr.length}`)
        //             this.createPapers(pr)
        //         }
        //     })
        const res = JSON.parse(localStorage.getItem('prResult'))
        console.log(res)
        const data = res.data
        console.log(data)
        if (res.success) {
            const date = new Date()
            this.$name.text(`姓名：${data.name}`)
            this.$time.text(`时间：${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
            const pr = data.data
            let rightCount = 0
            pr.forEach(item => {
                if (item.right) {
                    rightCount++
                }
            })
            this.$rightRate.text(`正确率：${rightCount}/${pr.length}`)
            this.createPapers(pr)
        }
    }

    createPapers(data) {
        const itemFragment = $(document.createDocumentFragment())
        const fragment = $(document.createDocumentFragment())
        data.forEach((item, index) => {
            item.type = item.type === 'radio' ? '【单选】' : '【多选】'
            itemFragment.append(
                $('<div>').addClass('paper-item')
                    .append(
                        $('<div>').addClass('item-title')
                            .append(
                                $('<span>').addClass('item-count').text(index + 1),
                                $('<span>').addClass('item-type').text(item.type),
                                $('<span>').addClass('item-description').text(item.description)
                            ),
                        $('<ul>').addClass('item-choice-group')
                            .append(
                                $('<li>').addClass('item-choice').append(
                                    $('<span>').addClass('choice-count').text('A'),
                                    $('<span>').addClass('choice-content').text(item.choices[0])
                                ),
                                $('<li>').addClass('item-choice').append(
                                    $('<span>').addClass('choice-count').text('B'),
                                    $('<span>').addClass('choice-content').text(item.choices[1])
                                ),
                                $('<li>').addClass('item-choice').append(
                                    $('<span>').addClass('choice-count').text('C'),
                                    $('<span>').addClass('choice-content').text(item.choices[2])
                                ),
                                $('<li>').addClass('item-choice').append(
                                    $('<span>').addClass('choice-count').text('D'),
                                    $('<span>').addClass('choice-content').text(item.choices[3])
                                )
                            ),
                        $('<div>').addClass('answers')
                            .append(
                                $('<span>').addClass('my-answer').text(`我的答案：${item.answer}`),
                                $('<span>').addClass('right-answer').text(`正确答案：${item.rightAnswer}`)
                            )
                    )
            )
            fragment.append(itemFragment)
        })
        this.$papers.append(fragment)
    }
}

$(() => {
    const pd = new PracticeDetail()
    pd.init()
})