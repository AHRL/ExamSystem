const express = require('express');
const api = express.Router();


api.post('/signin', function(req, res) {
    console.log(req.body);
    res.json(JSON.stringify({ 'status': 'ok' }));
});

api.post('/signup', function(req, res) {
    console.log(req.body);
    res.json(JSON.stringify({ 'status': 'ok' }));
});


module.exports = api;