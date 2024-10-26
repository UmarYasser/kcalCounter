const router = require('express').Router()
const exerciseCon = require('./../Controllers/exerciseController')
const authCon = require('./../Controllers/authController')

router.route("/addExercise").post(authCon.protect,authCon.strict("admin"),exerciseCon.addExercise)

module.exports = router