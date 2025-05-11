const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');

// Gutscheine anzeigen
router.get('/vouchers', adminController.getAllVouchers);

// Gutscheinanfrage genehmigen
router.post('/approve-voucher', adminController.approveCreatorVoucher);

module.exports = router;
