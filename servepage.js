const express = require("express");
const bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());

app.post('/api/register-user/', function(req, res) {
    console.log(req.body.name)
    console.log(req.body.phone)
    res.sendStatus(201)
})

var server = app.listen(8081, function(){
    var port = server.address().port
    console.log("Server started at http://localhost:%s", port)
});

module.exports = server;
