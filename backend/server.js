require('dotenv').config();  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const signupRouter = require('./routers/signupRouter');

const app = express();
const port = process.env.PORT || 6000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Debugging: Check if MongoDB URI is loaded
console.log("MongoDB URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error("❌ MongoDB connection error:", err));

app.use('/api/signup', signupRouter);

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
});
