const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/', ensureAuthenticated, invoiceController.getInvoices);
router.post('/add', ensureAuthenticated, invoiceController.createInvoice);
router.get('/:invoice_id', ensureAuthenticated, invoiceController.getInvoiceById);
router.get('/download/:invoice_id', ensureAuthenticated, invoiceController.downloadInvoice);

module.exports = router;
