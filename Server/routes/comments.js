const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const verifyToken = require('../middlewares/verifyToken');
const asyncMiddleware = require('../middlewares/async');
//get comments of a video
router.get('/:videoId',asyncMiddleware(commentController.getAllComments));
//new comment
router.post('/',verifyToken,asyncMiddleware(commentController.newComment));
//delete a comment
router.delete('/:id',verifyToken,asyncMiddleware(commentController.deleteComment));
module.exports = router;