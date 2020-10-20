const moongose = require('mongoose')

const UseSchema = new moongose.Schema({
    googleID: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
})

module.exports = moongose.model('User', UseSchema)