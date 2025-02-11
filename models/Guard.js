
const mongoose = require('mongoose');

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

const Guard = mongoose.model('Guard', guardSchema);
module.exports = {
    Guard
};
// module.exports = mongoose.model('Guard', guardSchema);