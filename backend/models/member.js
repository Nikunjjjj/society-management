const mongoose = require('mongoose');  // ✅ Correct spelling
const { encrypt, decrypt } = require("../auth/auth.js"); // Assuming these are defined properly in your auth.js

// Define the member schema
const member_data = new mongoose.Schema({
    id_Admin: { type: String },  // Use mongoose.Schema for ObjectId
    name: { type: String },
    mobile_number: { type: String },
    designation: { type: String },
    house_number: { type: String },
    password: {
        type: String,
        set: encrypt, // Encrypt the password before saving
        get: decrypt, // Decrypt the password when accessing it
    },
});

// Add getters to the schema to apply the `get` function (decryption) when the object is converted to JSON
member_data.set('toObject', { getters: true });
member_data.set('toJSON', { getters: true });

// Create the model from the schema
const Memmber = mongoose.model('Memmber', member_data);  // Define the Memmber model

module.exports = Memmber;
