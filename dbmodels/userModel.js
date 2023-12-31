const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    secondName: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true, validate(value) {if(!validator.isEmail(value)){throw new Error("Provide email addres")}}},
    password: {type: String, required: true, trim: true, minLength: 8},
    friends: [{type: mongoose.Types.ObjectId, ref: "User" }],
    tokens: {type: String},
    isActive: {type: Boolean, default :true}
})

userSchema.pre("save", async function(next){
    const user = this;
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 11)
    }
})

userSchema.methods.generateAuthTokens = async function (){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.SECRET_JWT)
    user.tokens = token;
    await user.save()
    return token
}

userSchema.methods.checkPassword = async( pass) => {
    const user = this
    const checkPassword = await bcrypt.compare(pass, user.password)
    if(!checkPassword){
        throw new Error("Provide correct password!")
    }
    return user
}

userSchema.statics.loginUser = async (email, pass) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error("Wrong Password or Username")
    }
    const checkPassword = await bcrypt.compare(pass, user.password)
    if(!checkPassword){
        throw new Error("Wrong Password or Username")
    }
    return user
}


const User = mongoose.model('User', userSchema)
module.exports = User