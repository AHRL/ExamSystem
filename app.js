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

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", ' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

app.get('/api/userinfo', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            username: 'Leo',
            major: '物联网工程',
            grade: '2015',
            other: 'll'
        }
    }))
});

app.get('/api/logout', (req, res) => {
    res.json(JSON.stringify({
        ret: true
    }))
});

app.get('/api/exam-list-for-sign', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: [{
            name: '翼灵招新考试',
            date: '2018/06/15 15:00-17:00',
            deadline: '2018/6/14 23:59',
            loc: '明理楼B404'
        }]
    }))
});

app.post('/api/user-sign-for-exam', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            'status': 'OK'
        }
    }))
});

app.get('/api/isExsit', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            isExsit: false
        }
    }))
});

app.get('/api/getValCode', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            valCode: 'HJ5Is9'
        }
    }))
});

app.get('/api/exam-detail', (req, res) => {
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
            }]
        }
    }));
});

app.post('/api/ready-exam', (req, res) => {
    res.json(JSON.stringify({
        ret: true,
        data: {
            status: 'OK'
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