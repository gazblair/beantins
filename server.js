const express = require("express");
const bodyParser = require("body-parser");
const userfactory = require('./userfactory')
const userrepository = require('./userrepository')

const repo = new userrepository.userRepository();

var app = express();

app.use(bodyParser.json());

app.post('/api/register-user/', function(req, res) {
    name = req.body.name
    phone = req.body.phone

    status = 201
    message = ""

    try {
        checkEligibleForRegistration(name, phone);

        const user = userfactory.create(name, phone);

        checkUserAccountDoesNotExist(user);
        registerUser(user);
 
    }
    catch(err) {
        status = err.status
        message = err.message
    }

    res.status(status).send(message)
})

var server = app.listen(8081, function(){
    let port = server.address().port
    console.log("Server started at http://localhost:%s", port)
});

module.exports = server;

function registerUser(user) {
    repo.register(user);
}

function throwException(message, status) {
    throw({message, status})
}

function checkEligibleForRegistration(name, phone) {
    if (!phone) {
        throwException("phone number is missing", 400)
    }
    if (!name) {
        throwException("name is missing", 400)
    }
}

function checkUserAccountDoesNotExist(user) {
    if (repo.isRegistered(user)){
        throwException("account already exists", 409)
    }
}

