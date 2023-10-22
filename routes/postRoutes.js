const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()


const isAuth = require('../middleware/isAuth')
const Post = require('../dbmodels/postModel')
const Comment = require('../dbmodels/commentModel')
const User = require('../dbmodels/userModel')
const Image = require('../dbmodels/imageModel')

// ShowAllPosts
router.get('/show-all-posts', async (req, res) => {
    const posts = await Post.find({})
    const images = await Image.find({})
    console.log('posty')
    console.log(posts)
    
    res.render('showPosts', {posts:posts, images:images})
})

// router.get('/show-all-posts',isAuth.authenticateToken,  async(req, res) => {
//     console.log(req.user)
//     if(req.user){
//         const currentUser = await User.findById({_id: req.user})
//         if(currentUser){
//             res.render('showAllPosts', {
//                 user:currentUser.name, 
//                 id: currentUser._id})

//         }
//     }
//     else{
//         res.redirect('/')
//     }
// })



// Create Post
router.post('/create-post', async (req, res) => {
 
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
        image:newImage._id,
        likes:0
    })
    console.log('saving to db')
    await post.save()
    console.log("Done")
    res.send('post created')
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

router.delete('/delete-post', isAuth.authenticateToken, async (req, res) =>{
    const del = await Post.findByIdAndDelete({_id: req.body._id})
    if(del){
        await Image.findByIdAndDelete({_id: del.image})
        res.redirect('/')
    }
    else{
        console.log("Error")
    }

})




// ShowPost


// UpdatePost


// CreateComment


// DeleteComment


module.exports = router