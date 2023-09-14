const express = require('express');
const router = express.Router();
const UserRouter = require('./userRouter');
const FriendRouter = require('./friendsRouter');
const TeamRouter = require('./teamsRouter');
const RequestRouter = require('./requestRouter');

router.use('/requests', RequestRouter);
router.use('/users', UserRouter);
router.use('/friends', FriendRouter);
router.use('/teams', TeamRouter);

module.exports = router