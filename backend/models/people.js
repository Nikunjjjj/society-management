const mongoose = require('mongoose');  // ✅ Correct spelling
const { encrypt, decrypt, authenticateToken } = require("../auth/auth.js")


const peopleSchema = new mongoose.Schema({
<<<<<<< Updated upstream
    name: { type: String, required: true },
    contact_number: { type: String, required: true, unique: true },
    complex_number: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String, required: true,
        set: encrypt, // Encrypt the password before saving
        get: decrypt
    },
=======
    name: String ,
    contact_number: String,
    complex_number: String,
    email: String,
    password: String,
>>>>>>> Stashed changes
});

const PeopleId = mongoose.model('PeopleId', peopleSchema);
peopleSchema.set('toObject', { getters: true })
peopleSchema.set('toJSON', { getters: true })

module.exports = PeopleId;
