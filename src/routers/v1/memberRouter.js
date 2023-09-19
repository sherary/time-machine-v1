const express = require('express');
const router = express.Router();
const TeamController = require('../../controllers/v1/teamController');
const Validator = require('../../middlewares/validators/members.validator');

router.get('/all/:teamID', Validator.IDPayload, Validator.checkPrivilege(), TeamController.ViewAllTeamMembers);
router.delete('/remove', Validator.TeamAndUserSchema, Validator.checkPrivilege(), TeamController.RemoveTeamMember);
router.patch('/block', Validator.TeamAndUserSchema, Validator.checkPrivilege(), TeamController.BlockTeamMember);
router.get('/blocked', Validator.IDPayload, Validator.checkPrivilege(), TeamController.ViewAllBlockedMembers);
router.post('/add', Validator.TeamAndUserSchema, Validator.checkPrivilege(), TeamController.InviteTeamMember);

module.exports = router;