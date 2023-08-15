const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/v1/userController')
const UserValidator = require('../../middlewares/validators/users.validator');

router.post('/register', UserValidator.RegisterPayload, UserController.Register);
router.post('/login', UserController.Login);
router.post('/logout', UserController.Logout);
router.get('/', UserController.GetAllUsers);
router.get('/:user_id', UserValidator.IDPayload, UserController.GetOneUser);
router.patch('/update/:user_id', UserValidator.UpdatePayload, UserController.UpdateUser);
router.delete('/delete/:user_id', UserValidator.IDPayload, UserController.DeleteUser);

module.exports = router;