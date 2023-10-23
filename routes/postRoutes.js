const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()


const isAuth = require('../middleware/isAuth')
const Post = require('../dbmodels/postModel')
const Comment = require('../dbmodels/commentModel')
const User = require('../dbmodels/userModel')
const Image = require('../dbmodels/imageModel')

// ShowAllPosts
router.get('/', async (req, res) => {
    const posts = await Post.find({})
    const images = await Image.find({})
    const comments = await Comment.find({})
    const users = await User.find({})


    res.render('showPosts', {posts:posts, images:images, comments:comments, users:users})
})

// ShowPost
router.get('/show-post/:_id', async (req, res) => {
    const post = await Post.findById({_id: req.params._id})
    const image = await Image.find({_id: post.image})
    const comments = await Comment.find({postId: post._id})
    const users = await User.find({})
    console.log(comments)
    res.render('showPost', {post:post, image:image, comments:comments, users:users})
})


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

// UpdatePost
router.post('/update-post', isAuth.authenticateToken, async (req, res) => {
    console.log("Hello")    
    try{

        const post = await Post.findById({_id: req.body.postId})
        await post.updateOne({
            postTitle: req.body.postTitle || post.postTitle,
            postDescription: req.body.postDescription || post.postDescription
        })
    }
    catch(err){
        console.log("ERROR")
    }
    res.redirect('/')
})



// Delete Post

router.post('/post-delete', isAuth.authenticateToken, async (req, res) =>{
    try{ 
        const del = await Post.findByIdAndDelete({_id: req.body.postId})
    console.log(del)
    if(del){
        await Image.findByIdAndDelete({_id: del.image})
        res.redirect('/')
    }
    else{
        console.log("Error")
    }}
    catch(err){
        console.log("ERROR")
    }

})




// CreateComment

router.post('/create-comment', isAuth.authenticateToken, async (req, res) => {
    const post = await Post.findById({_id: req.body.postId})
    
    const comment = new Comment({
            commentText:req.body.comment,
            author:req.body.author,
            postId:post._id
        })
    await comment.save()
    res.redirect('/')
})





// DeleteComment
router.post('/comment-delete', isAuth.authenticateToken, async (req, res) => {
    try{
        const del = await Comment.findByIdAndDelete({_id: req.body.commentId})
        if(del){
            res.redirect('/')
        }
        else{
            console.log("Error")
        }
    }
    catch(err){
        console.log("ERROR")
    }
    
})

module.exports = router