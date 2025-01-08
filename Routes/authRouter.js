const router = require('express').Router();
const authCon = require('./../Controllers/authController');
const dietCon = require('./../Controllers/DietController');
const path = require('path')

router.route('/signUp').post(authCon.signUp)
    .get((req,res)=>{
        res.sendFile(path.join(__dirname, '..','public','template','SignUp.html'))
    })
router.route('/logIn').post(authCon.logIn)
    .get( (req,res)=>{
        res.sendFile(path.join(__dirname, '..','public','template','LogIn.html'))
    })
router.route('/forgotPassword').patch(authCon.forgotPassword)
router.route('/resetPassword/:resetToken').patch(authCon.resetPassword)



module.exports = router