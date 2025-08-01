const router = require('express').Router()
const exerciseCon = require('./../Controllers/exerciseController')
const authCon = require('./../Controllers/authController')

router.route("/addExercise").post(authCon.protect,authCon.strict("admin"),exerciseCon.addExercise)
router.route("/showAllExercises").get(authCon.protect,exerciseCon.showAllExercise)
router.route('/liveSearch').post(authCon.protect,exerciseCon.liveSearch)
router.route('/findExercise').post(authCon.protect,exerciseCon.findExercise)

module.exports = router