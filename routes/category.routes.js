const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const category = require('../controllers/category.controllers');

router.use(verify);

router.post("/list", category.getAll);
router.get("/list/:id", category.getById);
router.put("/update", category.update);

module.exports = router;