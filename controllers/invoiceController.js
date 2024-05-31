const Invoice = require('../models/Invoice');
const Project = require('../models/Project');
const User = require('../models/User');
const ClockEntry = require('../models/ClockEntry');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    const projects = await Project.findAll();
    res.render('invoices', { invoices, projects, user: req.user });
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).send('Server error');
  }
};

exports.getInvoiceById = async (req, res) => {
  const { invoice_id } = req.params;
  try {
    const invoice = await Invoice.findById(invoice_id);
    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }
    res.render('invoice', { invoice, user: req.user });
  } catch (err) {
    console.error('Error fetching invoice:', err);
    res.status(500).send('Server error');
  }
};

exports.createInvoice = async (req, res) => {
  const { project_id } = req.body;
  const user_id = req.user.id;

  try {
    const project = await Project.findById(project_id);
    const clockEntries = await ClockEntry.findByProjectId(project_id);
    const userHours = {};

    clockEntries.forEach(entry => {
      const userId = entry.user_id;
      const hours = entry.clock_out_time ? (new Date(entry.clock_out_time) - new Date(entry.clock_in_time)) / (1000 * 60 * 60) : 0;
      if (!userHours[userId]) {
        userHours[userId] = 0;
      }
      userHours[userId] += hours;
    });

    const totalHours = Object.values(userHours).reduce((total, hours) => total + hours, 0);
    const totalCost = totalHours * 10; // €10 per hour

    // Ensure the invoices directory exists
    const invoicesDir = path.join(__dirname, '..', 'invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    // Generate Custom Invoice ID
    const now = new Date();
    const invoiceId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    // Generate PDF
    const pdfPath = `invoices/invoice_${invoiceId}.pdf`;
    const absolutePdfPath = path.join(__dirname, '..', pdfPath);
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(absolutePdfPath));

    // Add the logo
    const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo.png'); // Adjust the path as needed
    doc.image(logoPath, 20, 20, { width: 100 });

    doc.fontSize(20).text('GildeDevOps Solutions', 110, 57);
    doc.fontSize(10).text(`Invoice Number: INV-${invoiceId}`, 200, 65, { align: 'right' });
    doc.fontSize(10).text(`Invoice Date: ${now.toISOString().split('T')[0]}`, 200, 80, { align: 'right' });
    doc.fontSize(10).text(`Due Date: ${new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`, 200, 95, { align: 'right' });
    doc.moveDown();

    // Add company information
    doc.fontSize(12).text(project.company_name, 50, 160);
    doc.text(project.contact_name, 50, 175);
    doc.text(project.company_address, 50, 190);
    doc.text(project.company_zip, 50, 205);
    doc.text(project.company_country, 50, 220);
    doc.moveDown();

    doc.fontSize(12).text('Description', 50, 260);
    doc.fontSize(12).text('Employee', 200, 260);
    doc.fontSize(12).text('Hours Worked', 300, 260);
    doc.fontSize(12).text('Hourly Rate', 400, 260);
    doc.fontSize(12).text('Amount', 500, 260);

    // Add black line after headers
    doc.moveTo(50, 275)
       .lineTo(550, 275)
       .stroke();

    doc.moveDown();

    let position = 280;
    for (const [userId, hours] of Object.entries(userHours)) {
      const user = await User.findById(userId);
      doc.fontSize(10).text(project.name, 50, position);
      doc.fontSize(10).text(user.name, 200, position);
      doc.fontSize(10).text(hours.toFixed(2) + ' hours', 300, position);
      doc.fontSize(10).text('€10.00', 400, position);
      doc.fontSize(10).text('€' + (hours * 10).toFixed(2), 500, position);
      position += 20;
    }

    doc.moveDown();
    doc.fontSize(12).text('Subtotal: €' + totalCost.toFixed(2), 400, position);
    doc.fontSize(12).text('Tax (10%): €' + (totalCost * 0.10).toFixed(2), 400, position + 15);
    doc.fontSize(12).text('Total: €' + (totalCost * 1.10).toFixed(2), 400, position + 30);
    doc.moveDown();

    doc.fontSize(10).text('Payment Terms: Net 30', 50, position + 60);
    doc.fontSize(10).text('Payment Method: Bank Transfer', 50, position + 75);
    doc.fontSize(10).text('Bank Details:', 50, position + 90);
    doc.fontSize(10).text('Bank Name: Example Bank', 50, position + 105);
    doc.fontSize(10).text('Account Number: 123456789', 50, position + 120);
    doc.fontSize(10).text('SWIFT Code: EXAMP001', 50, position + 135);
    doc.moveDown();

    doc.fontSize(10).text('For any queries regarding this invoice, please contact:', 50, position + 165);
    doc.fontSize(10).text('GildeDevOps Solutions', 50, position + 180);
    doc.fontSize(10).text('Email: info@gildedevops.com', 50, position + 195);
    doc.fontSize(10).text('Phone: +1 (234) 567-890', 50, position + 210);

    doc.end();

    const invoiceData = { user_id, project_id, hours_worked: totalHours, pdf_path: pdfPath, invoice_id: invoiceId };
    await Invoice.create(invoiceData);

    res.redirect(`/invoices/${invoiceId}`);
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).send('Server error');
  }
};

exports.downloadInvoice = async (req, res) => {
  const { invoice_id } = req.params;
  try {
    const invoice = await Invoice.findById(invoice_id);
    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }
    const absolutePdfPath = path.join(__dirname, '..', invoice.pdf_path);
    res.download(absolutePdfPath);
  } catch (err) {
    console.error('Error downloading invoice:', err);
    res.status(500).send('Server error');
  }
};
