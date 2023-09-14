const express = require('express');
const router = express.Router();
const TeamController = require('../../controllers/v1/teamController');
const MemberRouter = require('./memberRouter');
const Auth = require('../../middlewares/authenticate');

router.use('/members', MemberRouter);
router.post('/new', TeamController.CreateTeam);
router.patch('/remove', TeamController.RemoveTeamMember);

router.post('/join', TeamController.JoinRequest);

router.get('/', TeamController.GetAllTeams);
router.get('/:teamID', TeamController.GetOneTeam);
router.delete('/delete/:teamID', TeamController.DisbandTeam);

module.exports = router;