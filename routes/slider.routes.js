const  express = require('express');
const router = express.Router();
const {verify} = require('../middleware/auth');
const slider = require('../controllers/slider.controllers');

router.use(verify);

router.get("/list", slider.getAll);
router.get("/list/:id", slider.getSliderById);
router.post("/create", slider.create);
router.put("/update", slider.update);
router.get("/contain/:id", slider.getById);
router.post("/contain/create", slider.createSlider);
router.put("/contain/update", slider.updateSlider);
router.delete("/contain/delete/:id", slider.deleteSlider);

module.exports = router;