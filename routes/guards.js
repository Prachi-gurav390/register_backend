// routes/guards.js
const express = require('express');
const router = express.Router();
const { Guard } = require('../models/Guard');
const { Log } = require('../models/Log');
const auth = require('../middleware/auth');

// Get all guards
router.get('/',auth, async (req, res) => {
    try {
        const guards = await Guard.find({}, { password: 0 });
        res.json(guards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get guard by ID
router.get('/:id',auth, async (req, res) => {
    try {
        const guard = await Guard.findById(req.params.id, { password: 0 });
        if (!guard) {
            return res.status(404).json({ message: 'Guard not found' });
        }
        res.json(guard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update guard profile
    router.patch('/:id',auth, async (req, res) => {
        try {
            const { contactNumber } = req.body;
            const guard = await Guard.findById(req.params.id);

            if (!guard) {
                return res.status(404).json({ message: 'Guard not found' });
            }

            // if (name) guard.name = name;
            if (contactNumber) guard.contactNumber = contactNumber;

            await guard.save();
            res.json(guard);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.delete('/:id',auth, async (req, res) => {
    try {
        const guard = await Guard.findByIdAndDelete(req.params.id);
        if (!guard) {
            return res.status(404).json({ message: 'Guard not found' });
        }
        res.json({ message: 'Guard deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get guard's approval history
router.get('/:id/approvals',auth, async (req, res) => {
    try {
        const logs = await Log.find({
            $or: [
                { 'outApproval.guard': req.params.id },
                { 'inApproval.guard': req.params.id }
            ]
        })
            .populate('student')
            .sort('-outTime');

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;