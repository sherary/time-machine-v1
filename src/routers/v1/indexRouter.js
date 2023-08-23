const express = require('express');
const router = express.Router();
const UserRouter = require('./userRouter');
const FriendRouter = require('./friendsRouter');

router.use('/users', UserRouter);
router.use('/friends', FriendRouter);

module.exports = router