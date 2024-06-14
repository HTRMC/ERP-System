// controllers/searchController.js
const Project = require('../models/Project');
const User = require('../models/User');
const Invoice = require('../models/Invoice');

exports.search = async (req, res) => {
  const query = req.query.q;
  const userRole = req.user.role_id;
  
  try {
    let results = [];
    
    // Search Projects
    if (userRole === 2 || userRole === 3) { // Manager or Admin
      const projects = await Project.search(query);
      results = results.concat(projects.map(project => ({
        type: 'Project',
        name: project.name,
        id: project.id
      })));
    }

    // Search Users
    if (userRole === 3) { // Admin
      const users = await User.search(query);
      results = results.concat(users.map(user => ({
        type: 'User',
        name: user.name,
        id: user.id
      })));
    }

    // Search Invoices
    if (userRole === 1 || userRole === 2 || userRole === 3) { // Any role
      const invoices = await Invoice.search(query);
      results = results.concat(invoices.map(invoice => ({
        type: 'Invoice',
        id: invoice.invoice_id,
        project: invoice.project_name
      })));
    }

    res.json(results);
  } catch (err) {
    console.error('Error during search:', err);
    res.status(500).send('Server error');
  }
};
