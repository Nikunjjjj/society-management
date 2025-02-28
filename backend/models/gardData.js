const mongoose = require('mongoose');  // ✅ Correct spelling

const gardSchema = new mongoose.Schema({
    name: String,
    contact_number: String,
    complex_number: String,
    email: String,
    password: String,
});

const GardId = mongoose.model('GardId', gardSchema);  // Removed `new`

module.exports = GardId;
