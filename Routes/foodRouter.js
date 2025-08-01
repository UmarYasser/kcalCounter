const router = require('express').Router();
const foodCon = require('./../Controllers/FoodController.js')
const authCon= require('./../Controllers/authController.js');

router.route('/addFood').post(authCon.protect,authCon.strict('admin'),foodCon.addFood)
router.route('/editFood/:id').patch(authCon.protect,authCon.strict('admin'),foodCon.editFood)
router.route('/getAllFoods').get(authCon.protect,foodCon.getAllFood);
router.route('/deleteFood/:id').delete(authCon.protect,authCon.strict('admin'),foodCon.deleteFood);
router.route('/liveSearch').post(foodCon.liveSearch)
router.route('/findFood').post(authCon.protect,foodCon.findFood)

module.exports= router