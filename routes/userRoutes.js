const express = require('express')
const router = express.Router()
const User = require('../dbmodels/userModel')
const isAuth = require('../middleware/isAuth') 
const mongoose = require('mongoose')
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

router.get('/users', isAuth.authenticateToken, async (req, res) => {
    try {
        if(req.user){
            const currentUser = await User.findById({_id: req.user})
            if(currentUser){
                let allUsers = await User.find({})
                console.log(currentUser._id)
                const newUsers = allUsers.filter(user => user._id.toString() !== currentUser._id.toString())
                
                res.render('users', {
                    users: newUsers,
                    currentUser: currentUser.friends,
                    id: currentUser._id
                })
    
            }
        }
    } catch (error) {
        
        res.render('error', {message: "Cannot get into profile without loggedin"})
    }

})

router.post('/addfriend', isAuth.authenticateToken, async (req, res) => {
    try {
        const friendId = req.body.friend; // Assuming these are string representations of ObjectId
        const secondFriendId = req.body.secondfriend;

        // Find both users
        const user = await User.findById(friendId);
        const secondUser = await User.findById(secondFriendId);

        if (user && secondUser) {
            // Check if they are already friends
            if (!user.friends.includes(secondFriendId) && !secondUser.friends.includes(friendId)) {
                // Add each other as friends
                user.friends.push(secondFriendId);
                secondUser.friends.push(friendId);

                // Save the updates
                await user.save();
                await secondUser.save();

                res.redirect('/');
            } else {
                // They are already friends
                res.redirect('/users');
            }
        } else {
            // One of the users does not exist
            res.render('error', { message: "One or both users not found" });
        }
    } catch (error) {
        console.error(error);
        res.render('error', { message: "Cannot add friend" });
    }
});




module.exports = router