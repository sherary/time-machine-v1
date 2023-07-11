const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/v1/userController')

router.post('/register', UserController.Register);
router.post('/login', UserController.Login);
router.post('/logout', UserController.Logout);
router.get('/', UserController.GetAllUsers);
router.get('/:user_id', UserController.GetOneUser);
router.patch('/update/:user_id', UserController.UpdateUser);
router.delete('/delete/:user_id', UserController.DeleteUser);

module.exports = router;