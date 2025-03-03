const mongoose = require('mongoose');  // ✅ Correct spelling
const { encrypt, decrypt, authenticateToken } = require("../auth/auth.js")

const gardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact_number: { type: String, required: true },
    complex_number: { type: String, required: true },
    email: { type: String, required: true },
    password: {
        type: String, required: true,
        set: encrypt, // Encrypt the password before saving
        get: decrypt
    },
});

const GardId = mongoose.model('GardId', gardSchema);  // Removed `new`

module.exports = GardId;
