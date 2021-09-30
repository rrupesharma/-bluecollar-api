const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const product = require('../controllers/product.controllers');

router.use(verify);
router.get("/getProductByTag/:tag_id", product.getProductByTag);
router.post("/list", product.getAll);
router.get("/list/:id", product.getById);
router.post("/create", product.create);
router.put("/update", product.update);
router.delete("/del/:id", product.del);
router.get("/category", product.category);
router.get("/subCategory", product.subCategory);
router.get("/filtersList", product.filtersList);
router.put("/updateSuppStatus", product.updateSupp);
router.get("/unApproveStock", product.unApproveStock);
router.post("/createBySupplier", product.createBySupplier);
router.put("/updateBySupplier", product.updateBySupplier);

module.exports = router;