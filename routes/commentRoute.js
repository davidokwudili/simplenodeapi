const express = require('express');
const authCon = require('../controllers/authController');
const commentCon = require('../controllers/commentController');
 

// use merge params to have access params in posts router
const router = express.Router({ mergeParams: true });


router.route('/:postId')
    .get(authCon.protect, commentCon.getComments)
    .post(authCon.protect, commentCon.createComment);

module.exports = router;