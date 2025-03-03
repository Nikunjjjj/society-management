const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');  // ✅ Correct spelling
const PeopleId = require("../models/people.js");
const secretKey = crypto.createHash('sha256').update(String('your-secret-key')).digest('base64').substr(0, 32);

const router = express.Router();

router.get('/signup', async (req, res) => {
    try {
        const body = req.body;
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body',
            })
        }
        const people = new PeopleId(body);
        await people.save()
        user = await UserLogin.findOne({ email: req.body.email, name: req.body.name });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User not found',
            })
        }
        const token = jwt.sign({ id: user._id.toString(), email: user.email }, secretKey, { expiresIn: '30000s' });
        res.status(200).json({
            success: true,
            token: token,
            user: user,
            message: 'Signup successful'
        });

    } catch (error) {
        res.status(400).json({
            error,
            message: 'Signup failed',
        })
    }


});

router.post('/login', async (req, res) => {
    try {
        const body = req.body;
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body',
            })
        }
        const user = await UserLogin.findOne({ email: req.body.email, name: req.body.name });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User not found',
            })
        }
        const token = jwt.sign({ id: user._id.toString(), email: user.email }, secretKey, { expiresIn: '30000s' });
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







