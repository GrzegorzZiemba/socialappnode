const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    commentText: {type: String, required: true},
    author: {type: mongoose.Types.ObjectId, ref: "User"},
    postId: {type: mongoose.Types.ObjectId, ref: "Post"},
},{
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment