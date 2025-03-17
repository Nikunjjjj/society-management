require('dotenv').config();  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const signupRouter = require('./routers/signupRouter');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: "*", // Change this to your frontend URL if needed (e.g., "http://localhost:3000")
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

// Debugging: Check if MongoDB URI is loaded
console.log("MongoDB URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error("❌ MongoDB connection error:", err));


app.use(signupRouter); // Ensure router has a base path


app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
});
