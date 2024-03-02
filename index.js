const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('node:fs');
const path = require('node:path');

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.static('api'));

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    mongoose.connect('mongodb+srv://ardhrubo:4Deh7h7SQq4VW5L1@cluster0.unggjbp.mongodb.net/B');
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB');
    });
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api/history', require('./api/route')); // corrected line
