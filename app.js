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

app.get('/v2/user/signup', function(req, res) {

});

app.post('/v2/user', function(req, res) {

});

app.get('/v2/valicode', function(req, res) {
    res.json({
        "success": true
    })
});

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