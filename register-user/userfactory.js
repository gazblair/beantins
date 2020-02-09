const { User } = require('./user')

const create = ({name, phonenumber}) => {
    return User({ name, phonenumber})
}

module.exports = {
    create
}