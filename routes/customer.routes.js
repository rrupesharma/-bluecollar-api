const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const customer = require('../controllers/customer.controllers');

router.use(verify);
router.post("/list", customer.getAll);
router.get("/list/:id", customer.getById);
router.get("/listByMenu", customer.allByMenu);
router.get("/listByPantry", customer.allByPantry);
router.post("/sendVerifcaltionlink", customer.sendVerifcaltionlink);

module.exports = router;