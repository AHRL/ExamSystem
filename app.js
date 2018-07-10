const express = require('express');
const path = require('path');
const app = express();

const router = require('./routes/router');
const api = require('./routes/testApi');

const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser('signed'));

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'src/main/resources/static/dist')));

app.all('*', function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/api/userinfo', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            username: 'Leo',
            major: '物联网工程',
            grade: '2015',
            email: '162089@qq.com',
            isAdmin: true
        }
    }))
});

app.get('/api/logout', (req, res) => {
    res.json(JSON.stringify({
        ret: true
    }))
});


//加一项token
app.get('/api/exam_list_for_sign', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: [{
            name: '翼灵招新考试',
            date: '2018/06/15 15:00-17:00',
            deadline: '2018/6/14 23:59',
            location: '明理楼B404',
            token: '123456'
        }]
    }))
});

app.post('/api/user_sign_for_exam', (req, res) => {
    console.log(req.body);
    res.json(JSON.stringify({
        ret: true,
        data: {
            'status': 'OK'
        }
    }))
});

app.get('/api/isExist', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            isExist: false
        }
    }))
});

app.post('/api/getValCode', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            valCode: 'HJ5Is9'
        }
    }))
});

app.get('/api/exam_detail', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            examing: [{
                name: '翼灵招新考试',
                date: '2018/06/15 15:00-17:00',
                deadline: '2018/6/14 23:59',
                loc: '明理楼B404' 
            }],
            examed: [{
                name: '翼灵招新考试',
                date: '2018/06/15 15:00-17:00',
                score: 75 
            }, {
                name: '翼灵招新考试',
                date: '2018/06/15 15:00-17:00',
                score: 80
            }]
        }
    }));
});

app.post('/api/ready_exam', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            status: 'OK'
        }
    }))
});

app.get('/api/exam', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        time: '120',
        data: [{
            type: 'radio',
            describe: '下列哪个样式定义后,内联(非块状)元素可以定义宽度和高度',
            content: [
                'Check this custom checkbox',
                'Check this custom checkbox',
                'Check this custom checkbox',
                'Check this custom checkbox'
            ]
        }, {
            type: 'checkbox',
            describe: '下列哪个样式定义后,内联(非块状)元素可以定义宽度和高度',
            content: [
                'Check this custom checkbox',
                'Check this custom checkbox',
                'Check this custom checkbox',
                'Check this custom checkbox'
            ]
        }, {
            type: 'jianda',
            describe: '下列哪个样式定义后,内联(非块状)元素可以定义宽度和高度',
            content: []
        }]
    }))
});

app.post('/api/exam_submit', upload.array(), (req, res) => {
    console.log(req.body);
    res.json(JSON.stringify({
        ret: true,
        data: [{
            status: 'OK'
        }]
    }))
});

app.get('/api/examed_detail', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            chart: {
                type: 'column'
            },
            title: {
                text: '已考试卷'
            },
            subtitle: {
                text: '数据截止 2018-05'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45  // 设置轴标签旋转角度
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '参考人数 (人)'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: '参考人数: <b>{point.y} 人次</b>'
            },
            series: [{
                name: '总人数',
                data: [
                    ['上海', 24],
                    ['卡拉奇', 23],
                    ['北京', 21],
                    ['德里', 16],
                    ['拉各斯', 16],
                    ['天津', 15],
                    ['伊斯坦布尔', 14],
                    ['东京', 13],
                    ['广州', 13],
                    ['孟买', 12],
                    ['莫斯科', 12],
                    ['圣保罗', 12],
                    ['深圳', 10],
                    ['雅加达', 10],
                    ['拉合尔', 10],
                    ['首尔', 9],
                    ['武汉', 9],
                    ['金沙萨', 9],
                    ['开罗', 9],
                    ['墨西哥', 8]
                ],
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    // format: '{point.y:.1f}', // :.1f 为保留 1 位小数
                    y: 10
                }
            }]
        }
    }))
});

app.get('/api/exam_sign_detail', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            chart: {
                type: 'bar'
            },
            title: {
                text: '待考试卷/报名人数'
            },
            subtitle: {
                text: '数据截止：2018-05-15'
            },
            xAxis: {
                categories: ['C', '招新'],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '报名人数 (人)',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ' 人次'
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        allowOverlap: true // 允许数据标签重叠
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },
            series: [{
                name: '2018 年',
                data: [11, 99]
            }]
        }
    }))
});

app.get('/api/exam_categroy', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            title: {
                text: '试卷分类'
            },
            tooltip: {
                headerFormat: '{series.name}<br>',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true // 设置饼图是否在图例中显示
                }
            },
            series: [{
                type: 'pie',
                name: '试卷类型占比',
                data: [
                    ['数据结构',   22.0],
                    ['web 前端',       26.8],
                    {
                        name: 'C语言',
                        y: 12.8,
                        sliced: true,
                        selected: true
                    },
                    ['web 后端',    8.5],
                    ['Android',     6.2],
                    ['嵌入式',   23.7]
                ]
            }]
        }
    }))
});

app.post('/api/exam_add', upload.array(), (req, res) => {
    console.log(req.body);
    res.json(JSON.stringify({
        ret: true,
        data: {
            status: 'OK'
        }
    }))
})

app.get('/api/back', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: [{
            lang: 'C',
            type: 'radio',
            description: '第一题',
            content: [
                'Check this custom checkbox',
                'Check this custom checkbox',
                'Check this custom checkbox',
                'Check this custom checkbox'
            ]
        }, {
            lang: 'Java',
            type: 'checkbox',
            description: '第二题',
            content: [
                'Check this custom checkbox',
                'Check this custom checkbox',
                'Check this custom checkbox',
                'Check this custom checkbox'
            ]
        }, {
            lang: 'Python',
            type: 'others',
            description: '第三题',
        }, {
            lang: 'JavaScript',
            type: 'checkbox',
            description: '第四题',
            content: [
                'Check this custom checkbox',
                'Check this custom checkbox',
                'Check this custom checkbox',
                'Check this custom checkbox'
            ]
        }]
    }))
})

app.post('/api/modify', (req, res) => {
    res.json(JSON.stringify({
        success: true
    }))
})

app.post('/api/varifyPswd', (req, res) => {
    res.json(JSON.stringify({
        success: true,
        msg: '密码一致'
    }))
})

app.get('/api/showPapers', (req, res) => {
    res.json(JSON.stringify({
        success: true,
        readed: [{
            title: '招新',
            id: '8'
        }, {
            title: '招新',
            id: '9'
        }],
        reading: [{
            title: '翼灵',
            id: '10'
        }]
    }))
})

app.post('/api/showPStu', (req, res) => {
    res.json(JSON.stringify({
        success: true,
        data: [{
            name: 'Leo',
            stuEmail: '12345@qq.com',
            status: 'reading'
        }, {
            name: 'Jeo',
            stuEmail: '12345@qq.com',
            status: 'readed'
        }]
    }))
})

app.post('/api/showDetail', (req, res) => {
    res.json(JSON.stringify({
        success: true,
        data: {
            title: 'C语言测试',
            name: 'Leo',
            stuID: '201531060577',
            major: '物联网工程',
            chScore: 30,
            answers: [{
                title: '简述localStorage',
                score: 15,
                answer: '*************************************************************************************'
            }, {
                title: '简述localStorage',
                score: 10,
                answer: '*************************************************************************************'
            }]
        }
    }))
})

app.get('404', function(req, res) {
    res.send('404');
});

app.get('500', function(req, res) {
    res.send('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') +
        '; press Ctrl-C to terminate.');
});