const router = require('express').Router();
const foodCon = require('./../Controllers/FoodController.js')


router.route('/addFood').post(foodCon.addFood)

module.exports= router