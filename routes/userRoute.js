const express = require('express');
const authCon = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authCon.signup);
router.post('/login', authCon.login); 

module.exports = router;