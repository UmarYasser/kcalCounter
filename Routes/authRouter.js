const router = require('express').Router();
const authCon = require('./../Controllers/authController');
const dietCon = require('./../Controllers/DietController');

router.route('/signUp').post(authCon.signUp)
router.route('/logIn').post(authCon.logIn)
router.route('/forgotPassword').patch(authCon.forgotPassword)
router.route('/resetPassword/:resetToken').patch(authCon.resetPassword)



module.exports = router