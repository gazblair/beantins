"use strict"

const localTestSession = require('../test/local-test-session')
const remoteTestSession = require('../test/remote-test-session')

function create() {   
    if (process.env.TEST_MODE == "local"){
        return new localTestSession.LocalTestSession()
    }   
    else if (process.env.TEST_MODE == "remote"){
        return new remoteTestSession.RemoteTestSession()
    }
    else{
        throw("Unknown test mode: " + process.env.TEST_MODE)
    }   
}

module.exports = {
    create: create
}