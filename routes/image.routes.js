const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const images = require('../controllers/images.controllers');

router.use(verify);

router.post("/getById", images.getById);
router.post("/create", images.create);
router.delete("/delete/:img_id", images.del);

module.exports = router;