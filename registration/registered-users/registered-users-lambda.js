"use strict"

const registeredusers = require('./registered-users')

exports.handler = async (event) => {

    const registeredUsers = new registeredusers.RegisteredUsers()

    let result
    try {
        let user = JSON.parse(event.body)

        console.log("here's the event:")
        console.log(JSON.stringify(event))

        switch(event.path)
        {
            case "/login-user/":
                console.log("prepare to login")
                result = await registeredUsers.loginUser(user.name, user.phone)
                break
            case "/signup-new-user/":
                result = await registeredUsers.signUpNewUser(user.name, user.phone)
                break
        }        
    }
    catch(err) {
        console.log(JSON.stringify(err))
    }

    return result
}


