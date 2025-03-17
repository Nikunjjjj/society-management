const mongoose = require('mongoose');
const { encrypt, decrypt } = require("../auth/auth.js");

const adminSchema = new mongoose.Schema({
    society_name: { type: String },
    society_address: { type: String },
    society_logo: { type: String },
    builder_name: { type: String },
    builder_number: { type: String },
    society_admin_name: { type: String },
    society_admin_number: { type: String },
    society_admin_email: { type: String },
    society_admin_password: {
        type: String,
        set: function (value) {
            return value ? encrypt(value) : undefined; // Encrypt only if value exists
        },
        get: function (value) {
            return value ? decrypt(value) : undefined; // Decrypt only if value exists
        }
    },
    designation: { type: String },
    varified: { type: Boolean, default: false }

});

// Apply schema configuration
adminSchema.set('toObject', { getters: true });
adminSchema.set('toJSON', { getters: true });

const Admin_Data = mongoose.model('Admin_Data', adminSchema);

module.exports = Admin_Data;
