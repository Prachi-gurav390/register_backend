const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const { Student } = require('../models/Student');
const { Guard } = require('../models/Guard');

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

// List of authorized guard emails
const AUTHORIZED_GUARD_EMAILS = [
    'prachigurav.390@gmail.com',
    'pikugurav007@gmail.com',
    '2002devesh.sharma@gmail.com',
    // Add more authorized guard emails
];

async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.REACT_APP_GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
}

// Student registration
router.post('/student/register', async (req, res) => {
    try {
        const { token, studentData } = req.body;
        const payload = await verifyGoogleToken(token);

        if (!payload.email.endsWith('@diu.iiitvadodara.ac.in')) {
            return res.status(400).json({ message: 'Invalid college email domain' });
        }

        const existingStudent = await Student.findOne({ email: payload.email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const student = new Student({
            ...studentData,
            email: payload.email,
            googleId: payload.sub
        });

        await student.save();
        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Guard registration
router.post('/guard/register', async (req, res) => {
    try {
        const { token, guardData } = req.body;
        const payload = await verifyGoogleToken(token);

        if (!AUTHORIZED_GUARD_EMAILS.includes(payload.email)) {
            return res.status(400).json({ message: 'Email not authorized for guard registration' });
        }

        const existingGuard = await Guard.findOne({ email: payload.email });
        if (existingGuard) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const guard = new Guard({
            ...guardData,
            email: payload.email,
            googleId: payload.sub
        });

        await guard.save();
        res.status(201).json({ message: 'Guard registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login (both student and guard)
router.post('/login', async (req, res) => {
    try {
        const { token, type } = req.body;
        const payload = await verifyGoogleToken(token);

        if (type === 'student') {
            const Model = Student;
            const user = await Model.findOne({ email: payload.email });
            // const stud = await Student.findOne({ googleId: payload.sub });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    contactNumber: user.contactNumber,
                    batchNumber: user.batchNumber,
                    roomNumber: user.roomNumber,
                    rollNumber: user.rollNumber,
                    type
                }
            });
        }
        else {
            const Model = Guard;
            const user = await Model.findOne({ email: payload.email });
            // const stud = await Student.findOne({ googleId: payload.sub });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    contactNumber: user.contactNumber,
                    type
                }
            });
        }
        // const Model = type === 'student' ? Student : Guard;
        // const user = await Model.findOne({ email: payload.email });

        // if (!user) {
        //     return res.status(404).json({ message: 'User not found' });
        // }

        // res.json({
        //     user: {
        //         id: user._id,
        //         name: user.name,
        //         email: user.email,
        //         type
        //     }
        // });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;