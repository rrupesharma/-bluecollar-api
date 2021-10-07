const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const wishlist = require('../controllers/wishlist.controllers');

router.post("/create", wishlist.create);
router.put("/update", wishlist.updateById);
router.delete("/del/:id", wishlist.deleteById);
router.get("/getById", wishlist.getById);
router.post("/list", wishlist.getAll);


module.exports = router;