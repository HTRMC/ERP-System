// controllers/projectController.js
const db = require('../config/db');

exports.getProjects = async (req, res) => {
  try {
    const [projects] = await db.query('SELECT * FROM projects');
    res.render('projects', { projects });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.createProject = async (req, res) => {
  const { name, description, start_date, end_date } = req.body;
  try {
    await db.query('INSERT INTO projects (name, description, start_date, end_date) VALUES (?, ?, ?, ?)', [name, description, start_date, end_date]);
    res.redirect('/projects');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const [project] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (project.length === 0) {
      return res.status(404).send('Project not found');
    }
    res.render('project', { project: project[0] });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
