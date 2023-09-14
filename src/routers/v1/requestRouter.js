const express = require('express');
const router = express.Router();
const TeamController = require('../../controllers/v1/teamController');
const RequestsController = require('../../controllers/v1/requestController');
const Auth = require('../../middlewares/authenticate');

// Get requests
router.get('/', RequestsController.getAllRequests);
router.get('/friends', RequestsController.getAllFriendRequests);
router.get('/teams', RequestsController.getAllTeamRequests);

// Accept requests
router.post('/friends', RequestsController.acceptFriendRequest);
router.post('/teams', RequestsController.acceptTeamRequest);


// Send Request 
router.post('/new-friend', RequestsController.sendFriendRequest);
router.post('/new-team', RequestsController.sendTeamRequest);

module.exports = router;