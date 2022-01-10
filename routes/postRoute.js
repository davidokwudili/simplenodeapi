const express = require('express');
const authCon = require('../controllers/authController');
const postCon = require('../controllers/postControler');
const commentRoute = require('../routes/commentRoute');

const router = express.Router();


// POST: posts/12/comments
// GET: posts/23/comments 
router.use('/:postId/comments', commentRoute);


router.route('/')
    .get(authCon.protect, postCon.getPosts)
    .post(authCon.protect, postCon.createPost);

module.exports = router;