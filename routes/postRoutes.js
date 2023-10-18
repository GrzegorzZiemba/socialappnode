const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

const isAuth = require('../middleware/isAuth')
const Post = require('../dbmodels/postModel')
const Comment = require('../dbmodels/commentModel')
const User = require('../dbmodels/userModel')




// Create Post
router.get('create-post',isAuth.authenticateToken, async(req, res) => {
    if(req.user){
        const currentUser = await User.findById(req.user)
        if(currentUser){
            res.render('create-post', {
                user:currentUser, 
                id: currentUser._id})
        }
    }
    else{
        res.redirect('/')
    }
})

router.post('create-post', async (req, res) => {
    const post = new Post(req.body)
    await post.save()

})

// Delete Post


// ShowAllPosts


// ShowPost


// UpdatePost


// CreateComment


// DeleteComment


module.exports = router