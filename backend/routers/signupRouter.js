const express = require('express');

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');  // ✅ Correct spelling
const Memmber = require("../models/member");  // ✅ Correct spelling
const Admin_Data = require("../models/admin_Data");  // ✅ Correct spelling
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

router.post('/signup', async (req, res) => {
    const body = req.body;
    console.log(body)

});

// router.post('/login', async (req, res) => {
//     try {
//         const body = req.body;
//         if (!body) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'You must provide a body',
//             })
//         }
//         const user = await PeopleId.findOne({ email: req.body.email, name: req.body.name });
//         if (!user) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'User not found',
//             })
//         }
//         const token = jwt.sign({ id: user._id.toString(), email: user.email }, secretKey, { expiresIn: '30000s' });
//         res.status(200).json({
//             success: true,
//             token: token,
//             user: user,
//             message: 'Login successful'
//         });

//     } catch (error) {
//         res.status(400).json({
//             error,
//             message: 'Login failed',
//         })
//     }
// });

module.exports = router;







