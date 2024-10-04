const router = require('express').Router();
const authCon = require('./../Controllers/authController')
const trakcerCon = require('./../Controllers/trackerController')

router.route('/eat').post(authCon.protect,trakcerCon.eat)
router.route('/display').get(authCon.protect,trakcerCon.display)

module.exports = router