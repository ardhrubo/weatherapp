// Import necessary modules
const express = require('express');
const route = express.Router();
const History = require('./history');

/**
 * GET /
 * Route for getting all history records.
 * It uses the find() method from the History model to fetch all records.
 * If an error occurs, it sends a 500 status code with a message.
 */
route.get('/', (req, res) => {
    History.find()
    .then(history => {
        res.json(history);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Error Occurred'
        });
    });
});

/**
 * POST /
 * Route for creating a new history record.
 * It creates a new instance of the History model with the request body,
 * saves it to the database, then fetches all records again to send as the response.
 * If an error occurs, it sends a 500 status code with a message.
 */
route.post('/', (req, res) => {
    let history = new History(req.body);
    history.save()
    .then(() => History.find())
    .then(history => {
        res.status(201).json(history);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Unable to save to database'
        });
    });
});

// Export the router to be used in other parts of the application
module.exports = route;