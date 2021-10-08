const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const products = require('../controllers/products.controllers');

router.post("/create", products.create);
router.get("/getById", products.getById);
router.post("/list", products.getAll);


module.exports = router;