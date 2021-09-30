const express = require('express');
const router = express.Router();
const { verify } = require('../middleware/auth');
const cron = require('../controllers/cron.controllers');

router.use(verify);
router.post("/list", cron.getAll);
router.get("/list/:id", cron.getById);
router.post("/create", cron.create);
router.put("/update", cron.update);
router.put("/updateStatus", cron.updateStatus);
router.delete("/delete/:id", cron.del);

module.exports = router;