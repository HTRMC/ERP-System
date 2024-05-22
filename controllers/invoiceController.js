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
  const { id } = req.params;
  try {
    const invoice = await Invoice.findById(id);
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

    // Generate PDF
    const pdfPath = path.join(invoicesDir, `invoice_${Date.now()}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    // Add the logo
    const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo.png'); // Adjust the path as needed
    doc.image(logoPath, 20, 20, { width: 100 });

    doc.fontSize(16).text(`Invoice for Project: ${project.name}`, { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Total Hours Worked: ${totalHours.toFixed(2)} hours`);
    doc.text(`Total Cost: €${totalCost.toFixed(2)}`);
    doc.moveDown();
    
    doc.fontSize(14).text('Hours worked by each employee:', { underline: true });
    doc.moveDown();

    for (const [userId, hours] of Object.entries(userHours)) {
      const user = await User.findById(userId);
      doc.fontSize(12).text(`- ${user.name}: ${hours.toFixed(2)} hours`);
    }

    doc.end();

    const invoiceData = { user_id, project_id, hours_worked: totalHours, pdf_path: pdfPath };
    const invoiceId = await Invoice.create(invoiceData);

    res.redirect(`/invoices/${invoiceId}`);
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).send('Server error');
  }
};

exports.downloadInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }
    res.download(invoice.pdf_path);
  } catch (err) {
    console.error('Error downloading invoice:', err);
    res.status(500).send('Server error');
  }
};
