const express = require('express')
const router = express.Router()
const User = require('../dbmodels/userModel')



router.post('/login', async(req,res)=> {
    try {
        const user = await User.loginUser(req.body.email, req.body.password)
        const token = await user.generateAuthTokens()
        res.cookie('token', token, {httpOnly: true})
        res.redirect('/')
    } catch (error) {
        res.render('login', {error: "Wrong password or username"})
    }
})


router.post('/create-account', async(req,res)=> {
    try {
        console.log(req.body)
        const user = req.body
        const userExists = await User.find({email: user.email})
        if(userExists.length === 0){
            const account = new User({
                username: user.username,
                name: user.name,
                secondName: user.secondName,
                email: user.email,
                password: user.password
            })
            await account.generateAuthTokens()
            await account.save()
            res.redirect('/')
        }else{
            res.render('signup' , {error: "User Exists"})
        }
    } catch (error) {
        console.log("Error")
    }
})




router.get('/logout', (req,res)=> {
    res.clearCookie('token')
    res.redirect('/')
})
module.exports = router