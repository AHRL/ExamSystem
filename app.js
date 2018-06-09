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
app.use(express.static(path.join(__dirname, 'src/main/resources/static/dest')));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/', function(req, res) {
    res.send('home');
});

app.post('/api/signin', function(req, res) {
    console.log(req.body);
    res.json(JSON.stringify({ 'status': 'ok' }));
});

app.post('/api/signup', function(req, res) {
    console.log(req.body);
    res.json(JSON.stringify({ 'status': 'ok' }));
});

app.get('/api/getValCode', function(req, res) {
    res.json(JSON.stringify({ "valCode": "12Hb4s" }));
});

app.get('/api/exam-list-for-sign', function(req, res) {
    res.json(JSON.stringify([{
        "name": "翼灵物联工作室2018级招新笔试",
        "date": "2018/6/9 09:00-10:40",
        "deadline": "2018/6/8 23:59",
        "loc": "明理楼B区4楼 - 待定",
        "id": "sS1dYH7856Jd5K"
    }, {
        "name": "翼灵物联工作室2018级招新笔试",
        "date": "2018/6/9 09:00-10:40",
        "deadline": "2018/6/8 23:59",
        "loc": "明理楼B区4楼 - 待定",
        "id": "sS1dGHJ45Sx45s"
    }, {
        "name": "翼灵物联工作室2018级招新笔试",
        "date": "2018/6/9 09:00-10:40",
        "deadline": "2018/6/8 23:59",
        "loc": "明理楼B区4楼 - 待定",
        "id": "dshj56sdS456d5"
    }, {
        "name": "翼灵物联工作室2018级招新笔试",
        "date": "2018/6/9 09:00-10:40",
        "deadline": "2018/6/8 23:59",
        "loc": "明理楼B区4楼 - 待定",
        "id": "45HJKs54Hss13s"
    }]))
});

app.post('/api/user-sign-for-exam', function(req, res) {
    console.log(req.body);
    res.json(JSON.stringify({ "isSuccess": true }));
});

app.get('/api/userinfo', function(req, res) {
    res.json(JSON.stringify({ "name": "李友波" }));
});

app.get('/api/user-will-exam', function(req, res) {
    res.json(JSON.stringify({ "name": "sss" }));
});

app.get('/api/skillmap', function(req, res) {
    res.json(JSON.stringify({
        data: [{
            "name": "翼灵物联工作室",
            "symbolSize": 60,
            "draggable": "true"
        }, {
            "name": "Web 前端",
            "symbolSize": 40,
            "draggable": "true"
        }, {
            "name": "HTML5",
            "symbolSize": 20,
            "draggable": "true"
        }, {
            "name": "CSS3",
            "symbolSize": 20,
            "draggable": "true"
        }, {
            "name": "JavaScript",
            "symbolSize": 20,
            "draggable": "true"
        }, {
            "name": "Web 后端",
            "symbolSize": 40,
            "draggable": "true"
        }, {
            "name": "Java",
            "symbolSize": 20,
            "draggable": "true"
        }, {
            "name": "数据库",
            "symbolSize": 20,
            "draggable": "true"
        }, {
            "name": "Spring Boot",
            "symbolSize": 20,
            "draggable": "true"
        }, {
            "name": "Android",
            "symbolSize": 40,
            "draggable": "true"
        }, {
            "name": "嵌入式",
            "symbolSize": 40,
            "draggable": "true"
        }, {
            "name": "C/C++",
            "symbolSize": 20,
            "draggable": "true"
        }, {
            "name": "树莓派",
            "symbolSize": 20,
            "draggable": "true"
        }, {
            "name": "物联网",
            "symbolSize": 20,
            "draggable": "true"
        }, {
            "name": "数据分析",
            "symbolSize": 40,
            "draggable": "true"
        }, {
            "name": "Python",
            "symbolSize": 20,
            "draggable": "true"
        }, {
            "name": "爬虫",
            "symbolSize": 20,
            "draggable": "true"
        }],
        links: [{
            "source": "翼灵物联工作室",
            "target": "Web 前端"
        }, {
            "source": "翼灵物联工作室",
            "target": "Web 后端"
        }, {
            "source": "翼灵物联工作室",
            "target": "Android"
        }, {
            "source": "翼灵物联工作室",
            "target": "嵌入式"
        }, {
            "source": "翼灵物联工作室",
            "target": "数据分析"
        }, {
            "source": "Web 前端",
            "target": "HTML5"
        }, {
            "source": "Web 前端",
            "target": "CSS3"
        }, {
            "source": "Web 前端",
            "target": "JavaScript"
        }, {
            "source": "Web 后端",
            "target": "Java"
        }, {
            "source": "Web 后端",
            "target": "数据库"
        }, {
            "source": "Web 后端",
            "target": "Spring Boot"
        }, {
            "source": "Android",
            "target": 'Java'
        }, {
            "source": "嵌入式",
            "target": 'C/C++'
        }, {
            "source": "嵌入式",
            "target": '树莓派'
        }, {
            "source": "嵌入式",
            "target": '物联网'
        }, {
            "source": "数据分析",
            "target": 'Python'
        }, {
            "source": "数据分析",
            "target": '爬虫'
        }]
    }))
});

app.use(router);

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