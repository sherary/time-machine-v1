const express = require('express');
const router = express.Router();
const TeamController = require('../../controllers/v1/teamController');
const MemberRouter = require('./memberRouter');
const Auth = require('../../middlewares/authenticate');
const Validate = require('../../middlewares/validators/teams.validator');

// team creator route
router.use('/members', MemberRouter);
router.post('/new', Auth.isAuthenticated, Validate.CreateTeamPayload, TeamController.CreateTeam);
router.patch('/edit/:teamID', Auth.isAuthenticated, Validate.UpdatePayload, TeamController.EditTeam);
router.delete('/delete/:teamID', Auth.isAuthenticated, Validate.IDPayload, TeamController.DisbandTeam);

// user route
router.get('/:teamID', Auth.isAuthenticated, Validate.IDPayload, TeamController.GetOneTeam);

// dev only route
router.get('/', Auth.isAdmin, TeamController.GetAllTeams);

module.exports = router;