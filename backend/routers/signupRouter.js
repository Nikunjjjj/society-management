const express = require('express');

const mongoose = require('mongoose');  // ✅ Correct spelling


const PeopleId = require("../models/people.js");
const GardId = require("../models/gardData.js");

const router = express.Router();

router.get('/signup', (req, res) => {
    const body = req.body;
    const people = new PeopleId(body);
    people.save()
    res.send('Signup page');
})



module.exports = router;







