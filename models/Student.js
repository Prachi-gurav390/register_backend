
const mongoose = require('mongoose');

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


const Student = mongoose.model('Student', studentSchema);
module.exports = {
    Student
};


