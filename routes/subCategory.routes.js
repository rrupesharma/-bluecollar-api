const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const subCategory = require('../controllers/subCategory.controllers');

router.use(verify);

router.post("/list", subCategory.getAll);
router.get("/list/:id", subCategory.getById);
router.put("/update", subCategory.update);

module.exports = router;