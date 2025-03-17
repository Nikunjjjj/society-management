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
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,  // Ensure this is set in .env
            pass: process.env.EMAIL_PASS  // Ensure this is set in .env
        }
    });

    const verificationEndpoint = "https://yourdomain.com/api/verify";

    const emailHtml = `
        <p>Click the button below to verify your email:</p>
        <a href="${verificationEndpoint}?token=${token}" style="background: #28a745; color: white; padding: 10px 15px; text-decoration: none;">
            Verify Email
        </a>
    `;

    const info = await transporter.sendMail({
        from: `"Your App Name" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email",
        text: `Verify your email by clicking: ${verificationEndpoint}?token=${token}`,
        html: emailHtml,
    });

    console.log("Verification email sent:", info.messageId);
    return info;
}

// Signup Route
router.post('/signup', upload.single('photo'), async (req, res) => {
    try {
        console.log("Received signup request...");
        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);

        if (!req.file) {
            return res.status(400).json({ message: "File not uploaded. Ensure field name is 'photo'." });
        }

        // Upload file to Supabase
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
            mailVerify(token, savedAdmin.society_admin_email);

        } else {
            console.warn("No valid society members found.");
        }

        res.status(201).json({ message: "Signup successful" });
        mailVerify(savedAdmin.society_admin_email, token)
            .then(function (success) {
                console.log("Email sent successfully:", success.messageId);
            })
            .catch(function (error) {
                console.error("Email sent failed:", error);
            });




    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;
