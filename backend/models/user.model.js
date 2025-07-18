const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    displayName:{
        type:String,
        required: true
    },
    twitterId:{
        type:String,
        required: true,
        unique: true,
    },
    avatar:{
        type:String,
    }
})
const User = mongoose.model('User', userSchema)
module.exports = User