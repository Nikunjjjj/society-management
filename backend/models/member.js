const mongoose = require('mongoose');  // ✅ Correct spelling
const { encrypt, decrypt } = require("../auth/auth.js")

const member_data = new mongoose.Schema({
    id_Admin: { type: mangoose.Schema.Types.ObjectId },
    name: { type: String },
    mobile_number: { type: String },
    designation: { type: String },
    house_number: { type: String },
    password: {
        type: String,
        set: encrypt, // Encrypt the password before saving
        get: decrypt
    }
});

member_data.set('toObject', { getters: true })
member_data.set('toJSON', { getters: true })
const Memmber = mongoose.model('Memmber', member_data);  // Removed `new`

module.exports = Memmber;
