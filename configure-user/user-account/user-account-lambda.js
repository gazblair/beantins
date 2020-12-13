"use strict"

const useraccount = require('./user-account')

exports.handler = async (event) => {

    const userAccount = new useraccount.UserAccount()

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
            case "/signup-user/":
                result = await userAccount.signUp(user.name, user.phone)
                break
            default:
                console.log("Unknown event")
                result = {'statusCode': 404 }
        }        
    }
    catch(err) {
        console.log(JSON.stringify(err))
    }

    return result
}


