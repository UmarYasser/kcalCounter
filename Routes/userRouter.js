const router = require('express').Router();
const userCon = require('./../Controllers/userController');
const authCon = require('./../Controllers/authController');
const dietCon = require('./../Controllers/DietController');


router.route('/updatePassword').patch(authCon.protect,userCon.updatePassword);
router.route('/updateMe').patch(authCon.protect,userCon.updateMe);
router.route('/setUpDiet').post(authCon.protect,dietCon.setUp)
router.route('/displayDiet').get(authCon.protect,dietCon.display)

module.exports = router