const mongoose = require('mongoose');  // ✅ Correct spelling
const { encrypt, decrypt, authenticateToken } = require("../auth/auth.js");  // ✅ Ensure auth.js exists

const admin_data = new mongoose.Schema({
    society_name: { type: String, required: true },
    society_address: { type: String, required: true },
    society_logo: { type: String },
    builder_name: { type: String, required: true },
    builder_number: { type: String, required: true },
    society_admin_name: { type: String, required: true },
    society_admin_number: { type: String, required: true },
    society_admin_password: {
        type: String, required: true,
        set: encrypt, // Encrypt the password before saving
        get: decrypt
    },
    designation: { type: String, required: true },
    society_members: formattedMembers,
});

// ✅ Move schema configuration before defining model
admin_data.set('toObject', { getters: true });
admin_data.set('toJSON', { getters: true });

const Admin_Data = mongoose.model('Admin_Data', admin_data);

module.exports = Admin_Data;
