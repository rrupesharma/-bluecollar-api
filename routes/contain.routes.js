const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const contain = require('../controllers/contain.controllers');

router.use(verify);

router.get("/list", contain.getAll);
router.get("/list/:id", contain.getById);
router.post("/create", contain.create);
router.put("/update", contain.update);
router.delete("/delete/:id", contain.del);

module.exports = router;