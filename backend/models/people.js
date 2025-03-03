const mongoose = require('mongoose');  // ✅ Correct spelling


const peopleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact_number: { type: String, required: true, unique: true },
    complex_number: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String, required: true,
        set: encrypt, // Encrypt the password before saving
        get: decrypt
    },
});

const PeopleId = mongoose.model('PeopleId', peopleSchema);

module.exports = PeopleId;
