const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const membership = require('../controllers/membership.controllers');

router.post("/list", membership.getAll);
router.get("/getById", membership.getById);

module.exports = router;