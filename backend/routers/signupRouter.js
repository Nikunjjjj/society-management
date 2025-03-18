const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Member = require("../models/member");
const Admin_Data = require("../models/admin_Data");
const supabase = require('../common/supabaseClient');
const { json } = require('body-parser');
const nodemailer = require("nodemailer");
require('dotenv').config();

const router = express.Router();
const secretKey = crypto.createHash('sha256').update(String('your-secret-key')).digest('base64').substr(0, 32);

// Multer Configuration
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, PNG, and SVG files are allowed!'), false);
    }
};
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});



async function mailVerify(email, token) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,  // Use 465 for SSL, 587 for TLS
        secure: false,  // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,  // Ensure this is set in .env
            pass: process.env.EMAIL_PASS  // Ensure this is set in .env
        }
    });

    const verificationEndpoint = "http://localhost:5000/verify";

    const emailHtml = `
    <p>Click the button below to verify your email:</p>
    <a href="${verificationEndpoint}?token=${token}" 
        style="display: inline-block; background: #28a745; color: white; padding: 10px 15px; 
        text-decoration: none; border-radius: 5px;">
        Verify Email
    </a>

    <p>If the button doesn’t work, copy and paste the following URL into your browser:</p>
    <p><strong>${verificationEndpoint}?token=${token}</strong></p>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Your App Name" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Email",
            text: `Verify your email by clicking: ${verificationEndpoint}?token=${token}`,
            html: emailHtml,
        });

        console.log("Verification email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw the error if needed
    }
}


// Signup Route
router.post('/signup', upload.single('photo'), async (req, res) => {
    try {
        console.log("Received signup request...");
        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);

        // Upload file to Supabase
        let main_url_logo = ""
        if (req.file) {
            const fileName = `society-logos/${Date.now()}-${req.file.originalname}`;
            const { data, error } = await supabase.storage
                .from("pdfurl")
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    cacheControl: "3600",
                    upsert: false,
                });

            if (error) {
                console.error("Supabase Upload Error:", error);
                return res.status(500).json({ message: "File upload failed", error });
            }

            const publicUrl = supabase.storage.from("pdfurl").getPublicUrl(fileName)
            console.log("File uploaded successfully:", publicUrl);
            const main_url_logo = JSON.stringify(publicUrl.data.publicUrl);
        }
        // Parse society members safely
        let societyMembers = [];
        try {
            societyMembers = JSON.parse(req.body.society_members || "[]");
        } catch (parseError) {
            console.error("Error parsing society_members:", parseError);
            return res.status(400).json({ message: "Invalid society_members format." });
        }
        console.log("Society members <<<<<<<<<<<<<<<>>>>>>>>>>>>>:", req.body.society_name);
        // Create and Save Admin Data
        const admin = new Admin_Data({
            society_name: req.body.society_name,
            society_address: req.body.society_address,
            society_logo: main_url_logo,
            builder_name: req.body.builder_name,
            builder_number: req.body.builder_number,
            society_admin_name: req.body.society_admin_name,
            society_admin_email: req.body.society_admin_email,
            society_admin_password: req.body.society_admin_password,
            designation: req.body.Role,
        });

        const savedAdmin = await admin.save();
        console.log("Admin data saved successfully:", savedAdmin);
        const token = jwt.sign({ id: savedAdmin._id.toString(), email: savedAdmin.society_admin_email }, secretKey, { expiresIn: '2h' });
        console.log("Token generated successfully:", token);

        // Process society members
        if (Array.isArray(societyMembers) && societyMembers.length > 0) {
            for (const member of societyMembers) {
                const newMember = new Member({
                    id_Admin: savedAdmin._id,
                    name: member.name,
                    mobile_number: member.mobile_number,
                    designation: member.designation,
                    house_number: member.house_number,
                    password: member.password,
                    email: member.email
                });
                await newMember.save();
            }
            console.log("All society members saved successfully.");


        } else {
            console.warn("No valid society members found.");
        }
        mailVerify(savedAdmin.society_admin_email, token)
            .then(function (success) {
                console.log("Email sent successfully:", success.messageId);
            })
            .catch(function (error) {
                console.error("Email sent failed:", error);
            });

        res.status(201).json({ message: "Signup successful" });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: err.message });
    }
});
router.get('/verify', async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'Verification token is missing' });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, secretKey);
        if (!decoded || !decoded.email) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        console.log('Decoded token:', decoded);
        const objectaDMINId = new mongoose.Types.ObjectId(decoded.id);

        // Find admin and update verification status
        const admin = await Admin_Data.findOneAndUpdate({ _id: objectaDMINId, society_admin_email: decoded.email }, { verified: true });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (admin.verified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        admin.verified = true;
        await admin.save();

        res.status(200).json({ message: 'Email verified successfully' });

    } catch (error) {
        console.error('Email verification failed:', error);
        res.status(500).json({ message: 'Verification failed. Invalid or expired token' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const body = req.body;
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body',
            })
        }
        if (!body.society_admin_number || !body.society_admin_password) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a email and password',
            })
        }
        const user = await Admin_Data.findOne({ society_admin_number: body.society_admin_number });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User not found',
            })
        }
        if (user.verified == false) {
            return res.status(400).json({
                success: false,
                error: 'Your email has not been verified. Please verify your email and try again.'
            })
        }
        if (user.society_admin_password !== body.society_admin_password) { // Ensure decryption matches
            return res.status(401).json({ message: "Incorrect password" });
        }
        const token = jwt.sign({ id: user._id.toString(), email: user.society_admin_email }, secretKey, { expiresIn: '30000s' });
        res.status(200).json({
            success: true,
            token: token,
            user: user,
            message: 'Login successful'
        });

    } catch (error) {
        res.status(400).json({
            error,
            message: 'Login failed',
        })
    }
});

module.exports = router;
