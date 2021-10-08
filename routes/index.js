const express = require('express');
const admin = require('./admin.routes');
const product = require('./product.routes');
const salesorder = require('./salesorder.routes');
const supplier = require('./supplier.routes');
const customer = require('./customer.routes');
const mymenu = require('./mymenu.routes');
const pantry = require('./pantry.routes');
const tag = require('./tag.routes');
const emailTempate = require('./emailTempate.routes');
const image = require('./image.routes');
const category = require('./category.routes');
const subCategory = require('./subCategory.routes');
const cron = require('./cron.routes');
const feedback = require('./feedback.routes');
const slider = require('./slider.routes');
const contain = require('./contain.routes');
const user = require('./user.routes');
const membership = require('./membership.routes');
const wishlist = require('./wishlist.routes');
const productcategory = require('./productcategory.routes');
const router = express.Router();

router.use('/admin',admin);
router.use('/product',product);
router.use('/salesorder', salesorder);
router.use('/supplier',supplier);
router.use('/customer',customer);
router.use('/mymenu',mymenu);
router.use('/pantry',pantry);
router.use('/tag',tag);
router.use('/email-tempate',emailTempate);
router.use('/image',image);
router.use('/category',category);
router.use('/subCategory',subCategory);
router.use('/cron', cron);
router.use('/feedback', feedback);
router.use('/slider', slider);
router.use('/contain', contain);
router.use('/user', user);
router.use('/membership', membership);
router.use('/wishlist', wishlist);
router.use('/productcategory', productcategory);

module.exports = router;