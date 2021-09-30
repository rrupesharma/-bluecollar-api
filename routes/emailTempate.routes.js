const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const emailTemp = require('../controllers/emailTemp.controllers');


router.use(verify);
router.post("/list", emailTemp.getAll);
router.get("/list/:temp_id", emailTemp.getById);
router.post("/create", emailTemp.create);
router.put("/update", emailTemp.update);
router.put("/updateStatus", emailTemp.updateStatus);
router.delete("/delete/:temp_id", emailTemp.del);
router.post("/check-template", emailTemp.checkMail);


module.exports = router;