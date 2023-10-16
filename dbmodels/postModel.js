const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    postTitle: {type: String, required: true},
    postDescription: {type: String, required: true},
    author: {type: String, required: true},
    comments: {type :String, required: true},
    images: {type: String, required: true},
    likes: {type: Number, required: true, default: true}
}, {timestamps: true})


const Post = mongoose.model('Post', postSchema)
module.exports = Post