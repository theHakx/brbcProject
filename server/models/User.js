const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    phoneNumber:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    isPaid : {
        type:Boolean,
        default:false
    },
    ticket:{
        type:String,
        default:null
    }
})

module.exports = mongoose.model('User',userSchema)