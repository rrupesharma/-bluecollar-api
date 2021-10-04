const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const user = require('../controllers/user.controllers');

// router.use(verify);
router.post("/create", user.create);
router.post("/loginDomainCheck", user.loginDomainCheck);


module.exports = router;