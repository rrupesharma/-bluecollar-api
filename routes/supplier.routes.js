const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const supplier = require('../controllers/supplier.controllers');

router.use(verify);
router.get("/all", supplier.all);
router.post("/list", supplier.getAll);
router.post("/sendVerifcaltionlink", supplier.sendVerifcaltionlink);
router.get("/list/:id", supplier.getById);

module.exports = router;