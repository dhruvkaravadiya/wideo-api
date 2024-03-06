const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
// # Sign Up Default
router.post('/signup',asyncMiddleware(authController.signup));
// # Sign In
router.post('/signin',asyncMiddleware(authController.signin));
// # Logout
router.post('/logout',asyncMiddleware(authController.logout));
// # forgotpassword
router.post("/forgotpassword", asyncMiddleware(authController.forgotPassword));
// # reset password
router.post('/password/reset/:token',asyncMiddleware(authController.resetPassword));

module.exports = router;