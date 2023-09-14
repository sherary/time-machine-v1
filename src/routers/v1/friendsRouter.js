const express = require('express');
const router = express.Router();
const FriendController = require('../../controllers/v1/friendController');
const FriendValidator = require('../../middlewares/validators/friends.validator');
const Auth = require('../../middlewares/authenticate');

router.post('/request/send', Auth.isAuthenticated, FriendValidator.SendRequestPayload, FriendValidator.CheckIDMatch(), FriendController.SendFriendRequest);
router.patch('/request', Auth.isAuthenticated, FriendValidator.ConfirmConnectionPayload, FriendController.AcceptFriendRequest);
router.get('/', Auth.isAuthenticated, FriendController.GetAllFriends);
router.delete('/delete', Auth.isAuthenticated, FriendValidator.IDPayload, FriendValidator.CheckIDMatch(), FriendController.Delete);
router.delete('/delete/:clusterID', Auth.isAdmin, FriendValidator.ClusterIDPayload, FriendController.DeleteByClusterID);
router.delete('/delete-duplicates', Auth.isAdmin, FriendController.BulkDelete);

module.exports = router;