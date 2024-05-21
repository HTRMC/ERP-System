// controllers/projectController.js
const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.render('projects', { projects, user: req.user });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.createProject = async (req, res) => {
  const { name, description, start_date, end_date } = req.body;
  try {
    await Project.create({ name, description, start_date, end_date });
    res.redirect('/projects');
  } catch (err) {
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
    res.status(500).send('Server error');
  }
};
