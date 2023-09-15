const express = require('express');
const router = express.Router();
const TeamController = require('../../controllers/v1/teamController');
const MemberRouter = require('./memberRouter');
const Auth = require('../../middlewares/authenticate');

// team creator route
router.use('/members', MemberRouter);
router.post('/new', TeamController.CreateTeam);
router.delete('/delete', TeamController.DisbandTeam);

// user route
router.get('/:teamID', TeamController.GetOneTeam);

// dev only route
router.get('/', TeamController.GetAllTeams);

module.exports = router;