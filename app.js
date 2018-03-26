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