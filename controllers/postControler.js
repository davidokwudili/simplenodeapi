const catchAsync = require('./../utils/catchAsync');

const { Post } = require("../models");

exports.createPost = catchAsync(async (req, res, next) => {
    // object data
    const { title } = req.body;

    // create the new user
    const createdData = await Post.create({
        title,
        userId: req.user.id
    });

    res.status(201).json({
        status: true,
        data: {
            data: createdData
        }
    });
})

exports.getPosts = catchAsync(async (req, res, next) => {
    // I COULD DO PAGINATION FOR THE GET POST, BUT BECAUSE OF TIME, WILL JUST GI AHEAD AND GET ALL
    const documents = await Post.findAll({
        where: {
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
 