const router = require('express').Router();
const authCon = require('./../Controllers/authController');
const dietCon = require('./../Controllers/DietController');
const path = require('path')

router.route('/signUp').post(authCon.signUp)
router.route('/logIn').post(authCon.logIn)
   
router.route('/forgotPassword').patch(authCon.forgotPassword)
router.route('/resetPassword/:resetToken').patch(authCon.resetPassword)
router.route('/deleteUser').delete(authCon.protect,authCon.deleteUser)


module.exports = router