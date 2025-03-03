const mongoose = require('mongoose');  // ✅ Correct spelling


const peopleSchema = new mongoose.Schema({
    name: String,
    contact_number: String,
    complex_number: String,
    email: String,
    password: String
});

const PeopleId = mongoose.model('PeopleId', peopleSchema);

module.exports = PeopleId;
