const router = require('express').Router();
const userCon = require('./../Controllers/userController');
const authCon = require('./../Controllers/authController');

router.route('/updatePassword').patch(authCon.protect,userCon.updatePassword);
router.route('/updateMe').patch(authCon.protect,userCon.updateMe);

module.exports = router