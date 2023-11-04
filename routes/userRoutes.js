const express = require('express')
const router = express.Router()
const User = require('../dbmodels/userModel')

// Authentication and Authorization 


router.get('/login', (req,res) => {
    res.render('login', {error: ""})
})

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

router.get('/create-account', (req,res) => {
    res.render('signup', {error: ""})
})

router.post('/create-account', async(req,res)=> {
    try {
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
    }
})


router.get('/logout', (req,res)=> {
    res.clearCookie('token')
    res.redirect('/')
})



// User Profile

router.get('/profile', (req,res) => {
    res.render('profilePage')
})







module.exports = router