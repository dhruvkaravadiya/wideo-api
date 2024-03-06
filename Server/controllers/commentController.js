const Comment = require('../models/Comment');
const Video = require('../models/Video');
async function newComment(req,res){
    const comment = new Comment({...req.body,userId:req.user.id});
    const savedComment = await comment.save();
    res.send(savedComment); 
}

//a comment can be deleted by the person who commented , OR
//by the owner of the video
//thus req.user.id will contain the id of the current logged in user
//and the video model has Video.userId , which will contain the owner of the video
//and comment model has Comment.userId , which will contain the commenter of the comment
async function deleteComment(req,res){
    const comment  = await Comment.findById(req.params.id);
    const video  = await Video.findById(req.params.id);
    if(req.user.id == video.userId || req.user.id == comment.userId){
        await Comment.findByIdAndDelete(req.user.id);
        res.status(200).send('Comment Deleted Successfully');
    }
    else{
        return res.status(403).send('You can delete your won comment only!');
    }
}

async function getAllComments(req,res){
    const comments = await Comment.find({videoId:req.params.videoId});
    res.send(comments);
}
module.exports = {newComment , deleteComment ,getAllComments};