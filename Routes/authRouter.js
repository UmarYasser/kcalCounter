const router = require('express').Router();
const authCon = require('./../Controllers/authController');

router.route('/signUp').post(authCon.signUp)
router.route('/logIn').post(authCon.logIn)


module.exports = router