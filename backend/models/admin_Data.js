const mongoose = require('mongoose');  // ✅ Correct spelling
const { encrypt, decrypt } = require("../auth/auth.js");  // ✅ Ensure auth.js exists

const admin_data = new mongoose.Schema({
    society_name: { type: String },
    society_address: { type: String },
    society_logo: { type: String },
    builder_name: { type: String },
    builder_number: { type: String },
    society_admin_name: { type: String },
    society_admin_number: { type: String },
    society_admin_password: {
        type: String,
        set: encrypt, // Encrypt the password before saving
        get: decrypt
    },
    designation: { type: String }
});

// ✅ Move schema configuration before defining model
admin_data.set('toObject', { getters: true });
admin_data.set('toJSON', { getters: true });

const Admin_Data = mongoose.model('Admin_Data', admin_data);

module.exports = Admin_Data;
