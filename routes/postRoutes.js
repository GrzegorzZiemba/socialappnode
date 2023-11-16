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
    try{
        const posts = await Post.find({})
        const images = await Image.find({})
        const comments = await Comment.find({})
        const users = await User.find({})
    
    
        res.render('showPosts', {posts:posts, images:images, comments:comments, users:users})
    }
    catch(err){
        res.render('error', {message: "Cannot get posts from database"})
    }
 
})

// ShowPost
router.get('/show-post/:_id', async (req, res) => {
    try{
        const post = await Post.findById({_id: req.params._id})
        const image = await Image.find({_id: post.image})
        const comments = await Comment.find({postId: post._id})
        const users = await User.find({})
        res.render('showPost', {post:post, image:image, comments:comments, users:users})
    }
    catch(err){
        res.render('error', {message: "Cannot get post from database"})
    }

})


// Create Post
router.post('/create-post', async (req, res) => {
    try{
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
        await post.save()
        res.redirect('/')
    }catch(err){
        res.render('error', {message: "Cannot create post"})
    }
   
})

router.get('/create-post',isAuth.authenticateToken,  async(req, res) => {
    try{
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
    }catch(err){
        res.render('error', {message: "Cannot create post"})
    }
   
})

// UpdatePost
router.post('/update-post', isAuth.authenticateToken, async (req, res) => {
    try{

        const post = await Post.findById({_id: req.body.postId})
        await post.updateOne({
            postTitle: req.body.postTitle || post.postTitle,
            postDescription: req.body.postDescription || post.postDescription
        })
        res.redirect('/')
    }
    catch(err){
        res.render('error', {message: "Cannot update post"}) 
   }
   
})



// Delete Post

router.post('/post-delete', isAuth.authenticateToken, async (req, res) =>{
    try{ 
        const del = await Post.findByIdAndDelete({_id: req.body.postId})
    if(del){
        await Image.findByIdAndDelete({_id: del.image})
        res.redirect('/')
    }
    else{
        res.render('error', {message: "Cannot delete post"})      }}
    catch(err){
        res.render('error', {message: "Cannot delete post"})     }

})




// CreateComment

router.post('/create-comment', isAuth.authenticateToken, async (req, res) => {
    try{
        const post = await Post.findById({_id: req.body.postId})
    
        const comment = new Comment({
                commentText:req.body.comment,
                author:req.body.author,
                postId:post._id
            })
        await comment.save()
        res.redirect('/')
    }
    catch(err){
        res.render('error', {message: "Cannot create comment"})
    }
})





// DeleteComment
router.post('/comment-delete', isAuth.authenticateToken, async (req, res) => {
    try{
        const del = await Comment.findByIdAndDelete({_id: req.body.commentId})
        if(del){
            res.redirect('/')
        }
        else{
            res.render('error', {message: "Cannot delete comment"})          
        }
    }
    catch(err){
        res.render('error', {message: "Cannot delete comment"})    
}
    
})


router.get('/my-posts', isAuth.authenticateToken, async(req,res) => {
    try {
        const posts = await Post.find({author: req.user})
        res.render('myposts', {posts})
    } catch (error) {
        res.render('error', {message: "No posts found :)"})    

    }
})


router.get('/chat', isAuth.authenticateToken, async(req,res) => {
    try {
        const user = await User.find({_id: req.user})
        const name = user[0].name
        
        res.render('chat', {name});
    } catch (error) {
        
    }

})

module.exports = router