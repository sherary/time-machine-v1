const express = require('express');
const router = express.Router();
const TeamController = require('../../controllers/v1/teamController');

router.get('/join', TeamController.AcceptTeamMember);

module.exports = router;