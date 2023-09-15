const express = require('express');
const router = express.Router();
const TeamController = require('../../controllers/v1/teamController');

router.get('/all', TeamController.ViewAllTeamMembers);
router.delete('/remove', TeamController.RemoveTeamMember);
router.patch('/block', TeamController.BlockTeamMember);
router.post('/add', TeamController.InviteTeamMember);

module.exports = router;