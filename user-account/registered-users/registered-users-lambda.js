"use strict"

const registeredusers = require('./registered-users')

exports.handler = async (event) => {

    const userAccount = new registeredusers.UserAccount()

    let result
    try {
        let user = JSON.parse(event.body)

        console.log("here's the event:")
        console.log(JSON.stringify(event))

        switch(event.path)
        {
            case "/login-user/":
                console.log("prepare to login")
                result = await userAccount.loginUser(user.name, user.phone)
                break
            case "/signup-new-user/":
                result = await userAccount.signUp(user.name, user.phone)
                break
        }        
    }
    catch(err) {
        console.log(JSON.stringify(err))
    }

    return result
}


