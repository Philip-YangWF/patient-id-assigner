const express = require('express');
const app = express();
app.use(express.json());

let assignedPatients = {};
let availableIds = [];

// Endpoint to get assigned patients
app.get('/patients', (req, res) => {
    res.json(assignedPatients);
});

// Endpoint to update assigned patients
app.post('/patients', (req, res) => {
    assignedPatients = req.body;
    res.sendStatus(200);
});

// Endpoint to clear assigned patients
app.delete('/patients', (req, res) => {
    assignedPatients = {};
    res.sendStatus(200);
});

// Endpoint to get available IDs
app.get('/ids', (req, res) => {
    res.json(availableIds);
});

// Endpoint to update available IDs
app.put('/ids', (req, res) => {
    availableIds = req.body;
    res.sendStatus(200);
});

// Endpoint to clear available IDs
app.delete('/ids', (req, res) => {
    availableIds = [];
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
