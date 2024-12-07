const express = require('express');
const { userLogIn } = require('../Controllers/auth/auth')
const { userRequestsOtp, verifyOtp } = require('../Controllers/auth/otp')
const { verifyUserSignup } = require('../Controllers/auth/userSignup')
const { generateJWT, verifyJwt } = require('../Controllers/auth/jwt')
const router = express.Router();
const { submitIssue } = require('../Controllers/auth/issue')
const upload = require('../middlewares/multer')

router.post('/getUser', userLogIn);
router.get('/otp', userRequestsOtp);
router.get('/otp/verify', verifyOtp);
router.post('/verifyUser', verifyUserSignup)
router.post('/generateJwt', generateJWT)
router.post('/verifyJwt', verifyJwt)
router.post('/submitIssue', upload.array("media", 5), submitIssue)

module.exports = { router }