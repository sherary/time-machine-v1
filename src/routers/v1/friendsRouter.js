const express = require('express');
const router = express.Router();
const FriendController = require('../../controllers/v1/friendController');

router.post('/request/send', FriendController.SendFriendRequest);
router.get('/requests', FriendController.GetAllFriendRequests);
router.patch('/request', FriendController.AcceptFriendRequest);
router.get('/', FriendController.GetAllFriends);
router.get('/:userID', FriendController.GetOne);
router.delete('/delete', FriendController.Delete);

module.exports = router;