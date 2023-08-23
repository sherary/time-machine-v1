const express = require('express');
const router = express.Router();
const FriendController = require('../../controllers/v1/friendController');

router.post('/new', FriendController.Create);
router.get('/', FriendController.GetAll);
router.get('/:userID', FriendController.GetOne);
router.patch('/update/:userID', FriendController.Update);
router.delete('/delete/:userID', FriendController.Delete);

module.exports = router;