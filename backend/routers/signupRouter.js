const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const PeopleId = require("../models/people.js");

const secretKey = crypto.createHash('sha256').update('your-secret-key').digest('base64').substr(0, 32);
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, contact_number, complex_number } = req.body;
        console.log(req.body);

        // Check for missing fields
        if (!name || !email || !password || !contact_number || !complex_number) {
            return res.status(400).json({ success: false, error: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await PeopleId.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "Email already registered." });
        }

        // Create new user
        const people = new PeopleId(req.body);
        await people.save();

        // Generate token
        const token = jwt.sign({ id: people._id, email: people.email }, secretKey, { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            token,
            user: people,
            message: 'Signup successful',
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, error: "Signup failed. Try again later." });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required." });
        }

        // Find user
        const user = await PeopleId.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found." });
        }

        // Check password (Assuming you store encrypted passwords, modify accordingly)
        if (user.password !== password) {  // Change this if using hashed passwords
            return res.status(401).json({ success: false, error: "Incorrect password." });
        }

        // Generate token
        const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            token,
            user,
            message: 'Login successful',
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, error: "Login failed. Try again later." });
    }
});

module.exports = router;
