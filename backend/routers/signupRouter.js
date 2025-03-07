const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');  // ✅ Correct spelling
const Memmber = require("../models/member");  // ✅ Correct spelling
const Admin_Data = require("../models/Admin_Data");  // ✅ Correct spelling
const secretKey = crypto.createHash('sha256').update(String('your-secret-key')).digest('base64').substr(0, 32);

const supabase = require('../common/supabaseClient');
require('dotenv').config();
const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Check if the file is a PDF
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed.'));
        }
        cb(null, true);
    },
});


const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    try {

        const body = req.body;
        console.log(body)
    }

});



module.exports = router;
