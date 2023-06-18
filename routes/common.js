const express = require('express')
const router = express.Router();
const { signIn, signUp , signOut } = require("../controller/commonController");
const authCommon = require('../middleware/authCommon');
const { upload } = require('../middleware/multer');

router.post('/api/signup', upload.single("profileImage"), signUp)

router.post('/api/signin', signIn)

router.post('/api/signout', authCommon, signOut) 

module.exports = router