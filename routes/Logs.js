// routes/logs.js
const express = require('express');
const router = express.Router();
// const { Log, Student, Guard } = require('../models/index');
const { Log } = require('../models/Log');
const { Student } = require('../models/Student');
const { Guard } = require('../models/Guard');

// Create new outing request
router.post('/request-out', async (req, res) => {
  try {
    const { studentId, location } = req.body;

    const log = new Log({
      student: studentId,
      location,
      outTime: new Date(),
      outApproval: { status: 'pending' }
    });

    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request return entry
router.post('/request-in/:logId', async (req, res) => {
  try {
    const log = await Log.findById(req.params.logId);
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    log.inTime = new Date();
    log.inApproval = { status: 'pending' };
    await log.save();

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student's logs
router.get('/student/:studentId', async (req, res) => {
  try {
    const logs = await Log.find({ student: req.params.studentId })
      .populate('student')
      .populate('outApproval.guard')
      .populate('inApproval.guard')
      .sort('-outTime');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all logs (for guards)
router.get('/all', async (req, res) => {
  try {
    const logs = await Log.find()
      .populate('student')
      .populate('outApproval.guard')
      .populate('inApproval.guard')
      .sort('-outTime');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending requests
router.get('/pending', async (req, res) => {
  try {
    const logs = await Log.find({
      $or: [
        { 'outApproval.status': 'pending' },
        { 'inApproval.status': 'pending' }
      ]
    })
      .populate('student')
      .populate('outApproval.guard')
      .populate('inApproval.guard')
      .sort('-outTime');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/outside', async (req, res) => {
  try {
    const logs = await Log.find({
      $and: [
        { 'outApproval.status': 'approved' },
        { 'inApproval.status': 'blank' }
      ]
    })
      .populate('student')
      .populate('outApproval.guard')
      .populate('inApproval.guard')
      .sort('-outTime');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve request
router.patch('/approve/:logId', async (req, res) => {
  try {
    const { guardId, type } = req.body;
    const log = await Log.findById(req.params.logId);

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    if (type === 'out') {
      log.outApproval = {
        guard: guardId,
        status: 'approved',
        timestamp: new Date()
      };
    } else if (type === 'in') {
      log.inApproval = {
        guard: guardId,
        status: 'approved',
        timestamp: new Date()
      };
    }

    await log.save();
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;