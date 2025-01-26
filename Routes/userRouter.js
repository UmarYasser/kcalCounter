const router = require('express').Router();
const userCon = require('./../Controllers/userController');
const authCon = require('./../Controllers/authController');
const dietCon = require('./../Controllers/DietController');


router.route('/updatePassword').patch(authCon.protect,userCon.updatePassword);
router.route('/updateMe').patch(authCon.protect,userCon.updateMe);
router.route('/showAllUsers').get(/*authCon.protect,*/userCon.showAllUsers)
router.route('/deleteMe').delete(authCon.protect,userCon.deleteMe)

router.route('/setUpDiet').post(authCon.protect,dietCon.setUp)
router.route('/displayDiet').get(authCon.protect,dietCon.display)
router.route('/updateDiet').patch(authCon.protect,dietCon.updateDiet);
router.route('/makeFavorite/:foodId').post(authCon.protect,dietCon.makeFavorite);
module.exports = router