const express = require('express')
const router = express.Router()
const User = require('../dbmodels/userModel')
const isAuth = require('../middleware/isAuth') 
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
        res.render('error', {error: "Cannot CREATE"})

    }
})


router.get('/logout', (req,res)=> {
    res.clearCookie('token')
    res.redirect('/')
})



// User Profile

router.get('/profile',isAuth.authenticateToken, async(req,res) => {
    try {
        if(req.user){
            const currentUser = await User.findById({_id: req.user})
            if(currentUser){
                res.render('profilePage', {
                    user: currentUser._id})
    
            }
        }
    } catch (error) {
        
        res.render('error', {message: "Cannot get into profile without loggedin"})
    }
})

router.post('/update-profile', isAuth.authenticateToken, async (req, res) => {
    try{

        const user = await User.findById({_id: req.body.userId})
        if(req.body.password){
            if(req.body.password === req.body.password2){
                user.checkPassword(req.body.oldpassword)
                await user.updateOne({           
                    password: req.body.password || user.password
        
                })
            }
        }

        if(req.body.email){
            const findUser = await User.find({email: req.body.email})
            if(findUser.length > 0){
                res.render('error', {message: "EMAIL TAKEN"})

            }
            else{
                await user.updateOne({           
                    email: req.body.email || user.email,
        
                })
            }
        }
        await user.updateOne({
            name: req.body.name || user.name,
            secondname: req.body.secondname || user.secondName,
            username: req.body.username || user.username,

        })
        res.redirect('/')
    }
    catch(err){
        res.render('error', {message: "Cannot update post"}) 
   }
   
})





module.exports = router