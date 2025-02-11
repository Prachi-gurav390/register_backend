const mongoose = require('mongoose');

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
            enum: ['pending', 'approved', 'blank'],
            default: 'blank'
        },
        timestamp: Date
    }
}, {
    timestamps: true
});


const Log = mongoose.model('Log', logSchema);
module.exports = {
    Log
};