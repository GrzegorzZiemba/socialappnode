const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    postTitle: {type: String, required: true},
    postDescription: {type: String, required: true},
    author: {type: mongoose.Types.ObjectId, ref: "User"},
    comments: [{type :mongoose.Types.ObjectId, ref: "Comment"}],
    image: {type: mongoose.Types.ObjectId, ref: "Image"},
    likes: [{type :mongoose.Types.ObjectId, ref: "User"}]
}, {timestamps: true})


const Post = mongoose.model('Post', postSchema)
module.exports = Post