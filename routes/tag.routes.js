const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const tag = require('../controllers/tag.controllers');

router.use(verify);
router.post("/list", tag.getAll);
router.get("/list/:tag_id", tag.getById);
router.post("/create", tag.create);
router.put("/update", tag.update);
router.put("/updateStatus", tag.updateStatus);
router.delete("/delete/:tag_id", tag.del);
router.post("/addProduct", tag.addProduct);
router.post("/getTagProduct", tag.getTagProduct);
router.delete("/delProduct/:tag_map_id", tag.delProduct);

module.exports = router;