const express = require('express');
const router = express.Router();
const Reports = require('../schema/reportSchema.js');
const User = require('../schema/userSchema.js');

// Route to get all reports
router.get('/all-reports', async (req, res) => {
  try {
    const reports = await Reports.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to create a new report
router.post('/create-report', async (req, res) => {
  const report = new Reports({
    idOfWp: req.body.idOfWp,
    nameOfWp: req.body.nameOfWp,
    gradeOfWp: req.body.gradeOfWp,
    descriptionOfWp: req.body.descriptionOfWp,
    instructorId: req.body.instructorId,
    timeOfReport: req.body.timeOfReport,
    reporterId: req.body.reporterId,
    reason: req.body.reason
  });

  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to get a specific report by ID
router.get('/report/:id', async (req, res) => {
  try {
    const report = await Reports.findById(req.params.id);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to update a report by ID
router.patch('/update-report/:id', async (req, res) => {
  try {
    const updatedReport = await Reports.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete a report by ID
router.delete('/delete-report/:id', async (req, res) => {
  try {
    await Reports.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
