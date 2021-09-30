const express = require('express');
const router = express.Router();
const { verify } = require('../middleware/auth');
const feedback = require('../controllers/feedback.controllers');

router.use(verify);
router.post("/list", feedback.getAll);
router.get("/list/:id", feedback.getById);

module.exports = router;