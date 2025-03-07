const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Member = require("../models/member");
const Admin_Data = require("../models/admin_Data");
const supabase = require('../common/supabaseClient');
require('dotenv').config();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed.'));
        }
        cb(null, true);
    },
});

const router = express.Router();

// Creating local storage 
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        req.body;

        const {
            society_name,
            society_address,
            society_logo,
            builder_name,
            builder_number,
            society_admin_name,
            society_admin_password,
            designation,
            society_members
        } = req.body;

        // Create and Save Admin Data
        const admin = new Admin_Data({
            society_name,
            society_address,
            society_logo,
            builder_name,
            builder_number,
            society_admin_name,
            society_admin_password,
            designation
        });

        const savedAdmin = await admin.save();
        console.log(savedAdmin, "Successfully saved");

        localStorage.setItem('id_Admin', savedAdmin._id);
        const id_Admin = localStorage.getItem('id_Admin');

        console.log("Admin data saved successfully.");

        // Process society members
        if (Array.isArray(society_members) && society_members.length > 0) {
            console.log("Processing society members...");
            for (const [index, member] of society_members.entries()) {
                console.log(`Member ${index + 1}:`, member);
                const newMember = new Member({
                    id_Admin,
                    name: member.name,
                    mobile_number: member.mobile_number,
                    designation: member.role,
                    house_number: member.house_number,
                    password: member.password
                });

                await newMember.save();
                console.log(`Member ${index + 1} saved successfully.`);
            }
        } else {
            console.warn("No valid society members found or data is incorrect.");
        }

        res.status(201).json({ message: "Signup successful" });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
