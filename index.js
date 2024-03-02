/**
 * index.js
 * This file serves as the entry point for our Node.js application.
 * It sets up the Express server, connects to the MongoDB database, and defines some middleware.
 */

// Import necessary modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('node:fs');
const path = require('node:path');

// Initialize an Express application
const app = express();

// Use CORS middleware to handle cross-origin requests
app.use(cors());

// Serve static files from the 'public' and 'api' directories
app.use(express.static('public'));
app.use(express.static('api'));

// Define the port the server will listen on
const PORT = process.env.PORT || 3000;

// Start the server and connect to the MongoDB database
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    mongoose.connect('mongodb+srv://ardhrubo:4Deh7h7SQq4VW5L1@cluster0.unggjbp.mongodb.net/B');
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB');
    });
});

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Define a route for accessing history data
app.use('/api/history', require('./api/route')); // corrected line