const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const mymenu = require('../controllers/mymenu.controllers');

router.use(verify);
router.get("/all-menu/:user_id", mymenu.getMenuByUserId);
router.get("/all-meal/:menu_id", mymenu.getMealByMenu);
router.post("/list", mymenu.getAll);

module.exports = router;