const mongoose = require('mongoose');  // ✅ Correct spelling


const peopleSchema = new mongoose.Schema({
    name: String,
    phoneNo: String,
    address: String,
    flatNo: String,
});

const PeopleId = mongoose.model('PeopleId', peopleSchema);

module.exports = PeopleId;
