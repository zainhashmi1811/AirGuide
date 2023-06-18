const express = require('express')
const router = express.Router();
 const authUser = require('../middleware/authUser'); 
const { allDrivers } = require('../controller/userController');

router.get('/api/allDrivers', authUser, allDrivers) 

module.exports = router