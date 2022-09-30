// Models
const { Comment } = require('../models/comment.model');
const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util')

const getAllComments = catchAsync(async (req, res, next) => {
    // Include the user that wrote the comment
    // Include the post that the comment was made on
    // Include the author of the post where the comment was made on
    const comments = await Comment.findAll({
      include: [
        { 
            model: User 
        }, 
        { 
            model: Post, include: { model: User } 
        },
    ],
    });

    res.status(200).json({
      status: 'success',
      data: {
        comments,
      },
    });
});

const createComment = catchAsync(async (req, res, next) => {
    const { comment, postId } = req.body;
    const { sessionUser } = req;

    const newComment = await Comment.create({ comment, userId: sessionUser.id, postId });

    res.status(201).json({
      status: 'success',
      data: { newComment },
    });
});

const updateComment = catchAsync(async (req, res, next) => {
    const { newComment } = req.body;
    const { comment } = req;

    // Method 1

    // Method 2
    await comment.update({ comment: newComment });

    res.status(200).json({
      status: 'success',
      data: { comment },
    });
});

const deleteComment = catchAsync(async (req, res, next) => {
    const { comment } = req;

    // If comment exists, remove from db
    //* Method 1: Delete by using the model
    // Comment.destroy({ where: { id } })

    //* Method 2: Delete by using the model's instance
    // await comment.destroy()

    //* Method 3: Soft delete
    await comment.update({ status: 'deleted' });

    res.status(204).json({ status: 'success' });
});

module.exports = {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
};
