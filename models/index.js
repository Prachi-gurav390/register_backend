// models/index.js
const mongoose = require('mongoose');

// Student Schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    batchNumber: {
        type: String,
        required: true
    },
    roomNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /@diu\.iiitvadodara\.ac\.in$/.test(v);
            },
            message: 'Email must be a valid college email'
        }
    },
    googleId: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

// Guard Schema
const guardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

// Log Schema
const logSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    outTime: {
        type: Date,
        required: true
    },
    outApproval: {
        guard: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Guard'
        },
        status: {
            type: String,
            enum: ['pending', 'approved'],
            default: 'pending'
        },
        timestamp: Date
    },
    inTime: {
        type: Date
    },
    inApproval: {
        guard: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Guard'
        },
        status: {
            type: String,
            enum: ['pending', 'approved'],
            default: 'pending'
        },
        timestamp: Date
    }
}, {
    timestamps: true
});

// Create models from schemas
const Student = mongoose.model('Student', studentSchema);
const Guard = mongoose.model('Guard', guardSchema);
const Log = mongoose.model('Log', logSchema);

// Export all models
module.exports = {
    Student,
    Guard,
    Log
};