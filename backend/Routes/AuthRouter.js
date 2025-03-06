const express = require('express');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { signup, login } = require('../Controllers/AuthController');
const router = express.Router();

// router.post('/login', (req, res) => {
//     res.send('login success');
// });
router.post('/signup',signupValidation,signup)
router.post('/login',loginValidation,login)


module.exports = router;
