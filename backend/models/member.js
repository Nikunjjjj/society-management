const mongoose = require('mongoose');
const { encrypt, decrypt } = require("../auth/auth.js");

// Define the member schema
const memberSchema = new mongoose.Schema({
    id_Admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin_Data' }, // Reference Admin model
    name: { type: String, required: true },
    mobile_number: { type: String, required: true },
    designation: { type: String },
    house_number: { type: String },
    password: {
        type: String,
        set: function (value) {
            return value ? encrypt(value) : undefined; // Encrypt only if value exists
        },
        get: function (value) {
            return value ? decrypt(value) : undefined; // Decrypt only if value exists
        }
    },
    email: { type: String, required: true, unique: true }
});

// Apply schema configuration for getters
memberSchema.set('toObject', { getters: true });
memberSchema.set('toJSON', { getters: true });

// Create the model from the schema
const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
