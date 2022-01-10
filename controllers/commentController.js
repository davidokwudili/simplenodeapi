const catchAsync = require('./../utils/catchAsync');

const { Comment } = require("../models");

exports.createComment = catchAsync(async (req, res, next) => {
    // object data
    const { comment } = req.body;

    // create the new user
    const createdData = await Comment.create({
        comment,
        postId: req.params.postId,
        userId: req.user.id
    });

    res.status(201).json({
        status: true,
        data: {
            data: createdData
        }
    });
})

exports.getComments = catchAsync(async (req, res, next) => {
    // I COULD DO PAGINATION FOR THE GET POST, BUT BECAUSE OF TIME, WILL JUST GI AHEAD AND GET ALL
    const documents = await Comment.findAll({
        where: {
            postId: req.params.postId,
            userId: req.user.id
        }
    });

    res.status(200).json({
        status: true,
        data: {
            data: documents
        }
    });
})
 