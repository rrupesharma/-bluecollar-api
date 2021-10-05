const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const user = require('../controllers/user.controllers');

// router.use(verify);
router.post("/create", user.create);
router.post("/loginDomainCheck", user.loginDomainCheck);
//router.post("/list", user.getAll);
router.get("/profile",verify, user.getById);
router.post("/setForgotPassword", user.setForgotPassword);
router.post("/setChangePassword", user.setChangePassword);
router.post("/sendForgotPasswordLink", user.sendForgotPasswordLink);



module.exports = router;