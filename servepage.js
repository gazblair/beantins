const express = require("express");
const bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());

app.post('/api/register-user/', function(req, res) {
    console.log(req.body.name)
    console.log(req.body.phone)
    status = 201
    message = ""
    if (!req.body.phone)
    {
        message = "phone number is missing"
        status = 400
    }
    
    res.status(status).send(message)
})

var server = app.listen(8081, function(){
    var port = server.address().port
    console.log("Server started at http://localhost:%s", port)
});

module.exports = server;
