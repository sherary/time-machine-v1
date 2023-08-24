const express = require('express');
const router = express.Router();
const FriendController = require('../../controllers/v1/friendController');
const FriendValidator = require('../../middlewares/validators/friends.validator');
const Auth = require('../../middlewares/authenticate');

router.get('/requests', Auth.isAuthenticated, FriendController.GetAllFriendRequests);
router.post('/request/send', Auth.isAuthenticated, FriendValidator.SendRequestPayload, FriendController.SendFriendRequest);
router.patch('/request', Auth.isAuthenticated, FriendValidator.ConfirmConnectionPayload, FriendController.AcceptFriendRequest);
router.get('/', Auth.isAuthenticated, FriendController.GetAllFriends);
router.delete('/delete', Auth.isAuthenticated, FriendValidator.IDPayload, FriendController.Delete);

module.exports = router;