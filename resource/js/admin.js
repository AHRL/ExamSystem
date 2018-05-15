import '../scss/admin.scss';

class Admin {
    constructor() {
        this.$navTab = $('.navbar-nav');
        this.$conTab = $('.con-item');
        this.$moreBtn = $('.btn-more');
        this.$moreBlock = $('.more');
    }

    init() {
        this.tab();
        this.getMore();
    }

    tab() {
        this.$navTab.on('click', e => {
            e.preventDefault();
            const $target = $(e.target);
            const index = $target.index('.nav-link');
            if (index !== 4) {
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
        this.$moreBtn.toArray().forEach(item => {
            $(item).on('click', e => {
                e.preventDefault();
                const $target = $(e.target).parent().find('.card-title');
                const $title = this.$moreBlock.find('.h4');
                $title.text($target.text());
                this.$moreBlock.hide();
                this.$moreBlock.show();
                var options = {
                    chart: {
                        type: 'bar'                          //指定图表的类型，默认是折线图（line）
                    },
                    title: {
                        text: '我的第一个图表'                 // 标题
                    },
                    xAxis: {
                        categories: ['苹果', '香蕉', '橙子']   // x 轴分类
                    },
                    yAxis: {
                        title: {
                            text: '吃水果个数'                // y 轴标题
                        }
                    },
                    series: [{                              // 数据列
                        name: '小明',                        // 数据列名
                        data: [1, 0, 4]                     // 数据
                    }, {
                        name: '小红',
                        data: [5, 7, 3]
                    }]
                };
                // 图表初始化函数
                var chart = Highcharts.chart('more-content', options);
            })
        })
    }
}

$(document).ready(function() {
    const admin = new Admin();
    admin.init();
})