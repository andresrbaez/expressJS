const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Models
const { Post } = require('../models/post.model');
const { User } = require('../models/user.model');
const { Comment } = require('../models/comment.model');
const { PostImg } = require('../models/postImg.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const {
  storage,
  uploadPostImgs,
  getPostsImgsUrls,
} = require('../utils/firebase.util');

const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    where: { status: 'active' },
    attributes: ['id', 'title', 'content', 'createdAt'],
    include: [
      { model: User, attributes: ['id', 'name'] },
      {
        model: Comment,
        required: false,
        where: { status: 'active' },
        attributes: ['id', 'comment', 'status', 'createdAt'],
      },
      {
        model: PostImg,
      },
    ],
  });

  const postsWithImgs = await getPostsImgsUrls(posts);

  res.status(200).json({
    status: 'success',
    data: { posts: postsWithImgs },
  });
});

const createPost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { sessionUser } = req;

  const newPost = await Post.create({
    title,
    content,
    userId: sessionUser.id,
  });

  await uploadPostImgs(req.files, newPost.id);

  res.status(201).json({
    status: 'success',
    data: { newPost },
  });
});

const updatePost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { post } = req;

  // Method 1

  // Method 2
  await post.update({ title, content });

  res.status(200).json({
    status: 'success',
    data: { post },
  });
});

const deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  // If post exists, remove from db
  //* Method 1: Delete by using the model
  // Post.destroy({ where: { id } })

  //* Method 2: Delete by using the model's instance
  // await post.destroy()

  //* Method 3: Soft delete
  await post.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
};
