const router = require('express').Router();
const authCon = require('./../Controllers/authController')
const trakcerCon = require('./../Controllers/trackerController')

router.route('/eat').post(authCon.protect,trakcerCon.eat)
router.route('/display/:date').get(authCon.protect,trakcerCon.display)
router.route('/exercise').post(authCon.protect,trakcerCon.exercise)
router.route('/updateWater').patch(authCon.protect,trakcerCon.updateWater)
module.exports = router