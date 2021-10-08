const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const productcategory = require('../controllers/productcategory.controllers');

// router.use(verify);
router.post("/create", productcategory.create);
router.put("/updateById", productcategory.updateById);
router.post("/list", productcategory.getAll);




module.exports = router;