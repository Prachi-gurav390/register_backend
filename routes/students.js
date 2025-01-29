// routes/students.js
const express = require('express');
const router = express.Router();
const { Student } = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find({}, { password: 0 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get student by ID
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id, { password: 0 });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update student profile
router.patch('/:id', async (req, res) => {
    try {
        const { contactNumber, roomNumber } = req.body;
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (contactNumber) student.contactNumber = contactNumber;
        if (roomNumber) student.roomNumber = roomNumber;

        await student.save();
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete student (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;