const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const asyncMiddleware = require('../middlewares/async');
const verifyToken = require('../middlewares/verifyToken');
//update a user
router.put('/:id',verifyToken,asyncMiddleware(userController.updateUser));
//get a user
router.get('/find/:id',asyncMiddleware(userController.getUser));
//delete a user
router.delete('/:id',verifyToken,asyncMiddleware(userController.deleteUser));
//subscribe to a channel
router.put('/sub/:id',verifyToken,asyncMiddleware(userController.subscribe));
//unsubscribe from a channel
router.put('/unsub/:id',verifyToken,asyncMiddleware(userController.unSubscribe));
//send email
router.post('/sendemail',asyncMiddleware(userController.sendEmailToGmail));

module.exports = router;