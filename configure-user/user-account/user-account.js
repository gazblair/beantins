"use strict"

const useraccountdao = require('./user-account-dao')

class UserAccount {

    constructor() {
        const tableSuffix = process.env.AWS_STAGE
        this.useraccountdao = new useraccountdao.UserAccountDAO(tableSuffix)
    }

    buildResponse(status, message) {
        return {
            'statusCode': status,
            'body': JSON.stringify({
                message: message
            })
        }
    }

    async signUp(name, phone){
        try
        {
            this.checkEligibleForRegistration(name, phone)

            await this.checkUserAccountDoesNotExist(name, phone)
            await this.useraccountdao.register(name, phone)
            return this.buildResponse(201, "user registered")
        }
        catch(err) {
            return this.buildResponse(err.status, err.message)
        }
    }

    async loginUser(name, phone){
        try
        {
            await this.checkUserAccountExists(name, phone)
            return this.buildResponse(201, "user recognised")
        }
        catch(err) {
            console.log("buildResponse error" + JSON.stringify(err))
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

    async checkUserAccountExists(name, phone) {
        if (!await this.useraccountdao.isRegistered(name, phone)){
            this.throwException("account does not exist", 403)
        }
    }

    async checkUserAccountDoesNotExist(name, phone) {
        if (await this.useraccountdao.isRegistered(name, phone)){
            this.throwException("account already exists", 409)
        }
    }
}

module.exports = {
    UserAccount: UserAccount
}