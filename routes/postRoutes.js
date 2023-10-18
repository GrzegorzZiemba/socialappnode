const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()


const isAuth = require('../middleware/isAuth')
const Post = require('../dbmodels/postModel')
const Comment = require('../dbmodels/commentModel')
const User = require('../dbmodels/userModel')
const Image = require('../dbmodels/imageModel')
// Multer to handle uploading images





// Create Post
router.post('/create-post', async (req, res) => {
    console.log("CSRF token from form:", req.body._csrf);
    console.log("Generated CSRF token:", req.csrfToken());
    if (!req.file) {
        return res.send('No file uploaded');
    }
    let newImage = new Image();
    newImage.img.data = req.file.buffer;
    newImage.img.contentType = 'image/jpeg'; // or whichever mime type is suitable
    await newImage.save();
    const post = new Post({
        postTitle:req.body.postTitle,
        postDescription:req.body.postDescription,
        author:req.body.author,
        image:req.file.buffer,
        likes:0
    })
    await post.save()

})

router.get('/create-post',isAuth.authenticateToken,  async(req, res) => {
    console.log(req.user)
    if(req.user){
        const currentUser = await User.findById({_id: req.user})
        if(currentUser){
            res.render('createPost', {
                user:currentUser.name, 
                id: currentUser._id})

        }
    }
    else{
        res.redirect('/')
    }
})



// Delete Post


// ShowAllPosts


// ShowPost


// UpdatePost


// CreateComment


// DeleteComment


module.exports = router