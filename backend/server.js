require('dotenv').config();  // Load environment variables at the very top
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const signupRouter = require('./routers/signupRouter');

const app = express();
const port = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(express.json());
app.use()
console.log("MongoDB URI:", process.env.MONGODB_URI);  // Debugging step

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error("MongoDB connection error:", err));

app.use(signupRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
