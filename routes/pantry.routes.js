const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const pantry = require('../controllers/pantry.controllers');

router.use(verify);
router.get("/all-pantry/:user_id", pantry.getPantryByUserId);
router.post("/list", pantry.getAll);

module.exports = router;