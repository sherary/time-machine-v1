const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/v1/userController')
const UserValidator = require('../../middlewares/validators/users.validator');
const Auth = require('../../middlewares/authenticate');

router.post('/register', UserValidator.RegisterPayload, Auth.AuthenticateRegister, UserController.Register);
router.post('/login', UserValidator.LoginPayload, Auth.AuthenticateLogin, UserController.Login);
router.patch('/logout/:user_id', UserValidator.IDPayload, Auth.isAuthenticated, UserController.Logout);
router.get('/', UserController.GetAllUsers);
router.get('/:user_id', UserValidator.IDPayload, UserController.GetOneUser);
router.patch('/update/:user_id', UserValidator.UpdatePayload, UserController.UpdateUser);
router.delete('/delete/:user_id', UserValidator.IDPayload, UserController.DeleteUser);

module.exports = router;