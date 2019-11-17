class userRepository {
    constructor() {
        this.users = new Map()
    }

    isRegistered(user) {
        if (this.users.has(user.phonenumber)) {
            return true
        }
        return false
    }

    register(user) {
        this.users.set(user.phonenumber, user.name)
    }
}

module.exports = {
    userRepository: userRepository
}