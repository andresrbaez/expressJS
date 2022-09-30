const express = require('express');

// Controllers
const {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/comments.controller');

// Middlewares
const { commentExists } = require('../middlewares/comments.middleware');
const { protectSession, protectCommentsOwners } = require('../middlewares/auth.middlewares');
// const {
//   createPostValidators,
// } = require('../middlewares/validators.middlewares');

const commentsRouter = express.Router();

// Protecting below endpoints
commentsRouter.use(protectSession);

// Posts endpoints
commentsRouter.get('/', getAllComments);

commentsRouter.post('/', createComment);

commentsRouter.patch('/:id', commentExists, protectCommentsOwners, updateComment);

commentsRouter.delete('/:id', commentExists, protectCommentsOwners, deleteComment);

module.exports = { commentsRouter };
