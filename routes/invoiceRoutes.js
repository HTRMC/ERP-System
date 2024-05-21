const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/', ensureAuthenticated, invoiceController.getInvoices);
router.get('/:id', ensureAuthenticated, invoiceController.getInvoiceById);
router.post('/', ensureAuthenticated, invoiceController.createInvoice);

module.exports = router;
