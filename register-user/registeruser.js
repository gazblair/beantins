"use strict"

// const userfactory = require('./userfactory')

class RegisterUser {

    constructor(users){
       this.users = users
    }

    buildResponse(status, message) {
        return {
            'statusCode': status,
            'body': JSON.stringify({
                message: message
            })
        }
    }

    async register(name, phone){
        try
        {
            this.checkEligibleForRegistration(name, phone)

    //     const user = userfactory.create(name, phone);

            await this.checkUserAccountDoesNotExist(name, phone)
            await this.users.register(name, phone)
            return this.buildResponse(201, "user registered")
        }
        catch(err) {
            return this.buildResponse(err.status, err.message)
        }
    }

    throwException(message, status) {
        throw({message, status})
    }

    checkEligibleForRegistration(name, phone) {
        if (!phone) {
            this.throwException("phone number is missing", 400)
        }
        if (!name) {
            this.throwException("name is missing", 400)
        }
    }

    async checkUserAccountDoesNotExist(name, phone) {
        if (await this.users.isRegistered(name, phone)){
            this.throwException("account already exists", 409)
        }
    }
}

module.exports = {
    RegisterUser: RegisterUser
}