const router = require("express").Router()
const dietCon = require('./../Controllers/DietController');
const authCon = require("./../Controllers/authController")

router.post('/',authCon.protect,dietCon.makeFavorite);

module.exports = router