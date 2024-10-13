const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.post('/', salesController.addSale);

router.get('/', salesController.getAllSales);

router.get('/:sale_id', salesController.getSaleById);

module.exports = router;
