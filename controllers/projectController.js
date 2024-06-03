// controllers/projectController.js
const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.render('projects', { projects, user: req.user });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).send('Server error');
  }
};

exports.createProject = async (req, res) => {
  const { name, description, start_date, end_date, company_name, contact_name, company_address, company_zip, company_country } = req.body;
  console.log('Request body:', req.body); // Log request body for debugging
  try {
    const projectId = await Project.create({ name, description, start_date, end_date, company_name, contact_name, company_address, company_zip, company_country });
    console.log('Project created with ID:', projectId); // Log the created project ID
    res.redirect('/projects');
  } catch (err) {
    console.error('Error creating project:', err); // Log the error for debugging
    res.status(500).send('Server error');
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).send('Project not found');
    }
    res.render('project', { project, user: req.user });
  } catch (err) {
    console.error('Error fetching project by ID:', err); // Log the error for debugging
    res.status(500).send('Server error');
  }
};
