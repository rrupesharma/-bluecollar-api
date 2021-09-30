const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const salesorder = require('../controllers/salesorder.controllers');

router.use(verify);
router.post("/", salesorder.getAll);
router.get("/:id", salesorder.getById);

module.exports = router;