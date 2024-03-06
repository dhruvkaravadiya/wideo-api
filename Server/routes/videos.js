const express = require('express');
const videoController = require('../controllers/videoController');
const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const verifyToken = require('../middlewares/verifyToken');
//Find Video
router.get('/find/:id',asyncMiddleware(videoController.getVideo));
//Delete Video
router.delete('/delete/:id',verifyToken,asyncMiddleware(videoController.deleteVideo));
//New Video
router.post('/',verifyToken,asyncMiddleware(videoController.addVideo));
//Edit Video
router.put('/:id',verifyToken,asyncMiddleware(videoController.editVideo));
//increase video of a Video
router.put('/view/:id',asyncMiddleware(videoController.addView));
//trending Videos
router.get('/trending',asyncMiddleware(videoController.getTrendingVideos));
//random Videos
router.get('/random',asyncMiddleware(videoController.getRandomVideos));
//subscribed Videos
router.get('/subscribed',verifyToken,asyncMiddleware(videoController.getSubscribedVideos));
//search videos by tags
router.get('/tags',asyncMiddleware(videoController.getVideosByTags));
//search videos by title
router.get('/search',asyncMiddleware(videoController.searchVideosByTitle));
//get videos of a user
router.get('/:id',asyncMiddleware(videoController.getVideosByUserID));
//like a video
router.put('/like/:id',verifyToken,asyncMiddleware(videoController.like));
//remove like
router.put('/removelike/:id',verifyToken, asyncMiddleware(videoController.removeLike));
//remove dislike
router.put('/removelike/:id',verifyToken, asyncMiddleware(videoController.removeDislike));
//dislike a video
router.put('/dislike/:id',verifyToken,asyncMiddleware(videoController.dislike));
module.exports = router;