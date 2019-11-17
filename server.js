const express = require("express");
const bodyParser = require("body-parser");
const userfactory = require('./userfactory')
const userrepository = require('./userrepository')

var app = express();
const repo = new userrepository.userRepository();

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
    
    if (!req.body.name)
    {
        message = "name is missing"
        status = 400
    }
    if (status == 201)
    {
        const user = userfactory.create(req.body.name, req.body.phone)
        if (!repo.isRegistered(user)) {
            repo.register(user)
            status = 201
        }
        else {
            message = "account already exists"
            status = 409
        }
    }
    res.status(status).send(message)
})

var server = app.listen(8081, function(){
    let port = server.address().port
    console.log("Server started at http://localhost:%s", port)
});

module.exports = server;
