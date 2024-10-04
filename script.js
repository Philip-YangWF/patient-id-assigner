// Pool of existing IDs (default)
let idPool = [];

// Load assigned patient data from localStorage
let assignedPatients = JSON.parse(localStorage.getItem('assignedPatients')) || {};

// Load remaining IDs from localStorage or use the default pool
let availableIds = JSON.parse(localStorage.getItem('availableIds')) || [...idPool];

// Function to display the list of assigned patients
function displayAssignedPatients() {
    const patientList = document.getElementById('patientList');
    patientList.innerHTML = ''; // Clear the list before displaying

    for (let patient in assignedPatients) {
        const listItem = document.createElement('li');
        listItem.textContent = `${patient}: ${assignedPatients[patient]}`;
        patientList.appendChild(listItem);
    }
}

// Function to display the list of available IDs in the pool
function displayIdPool() {
    const idPoolList = document.getElementById('idPoolList');
    idPoolList.innerHTML = ''; // Clear the list before displaying

    availableIds.forEach(id => {
        const listItem = document.createElement('li');
        listItem.textContent = id;
        idPoolList.appendChild(listItem);
    });
}

// Function to assign IDs to patients
function assignID() {
    const patientName = document.getElementById('patientName').value.trim();
    if (!patientName) {
        alert('Please enter a valid patient name.');
        return;
    }

    if (assignedPatients[patientName]) {
        alert(`Patient ${patientName} already has an ID assigned: ${assignedPatients[patientName]}`);
        return;
    }

    if (availableIds.length === 0) {
        alert("No more IDs available in the pool.");
        return;
    }

    // Randomly select an ID from the pool
    const randomIndex = Math.floor(Math.random() * availableIds.length);
    const assignedId = availableIds.splice(randomIndex, 1)[0];

    // Assign the ID to the patient
    assignedPatients[patientName] = assignedId;

    // Save the updated patient data and available IDs in localStorage
    localStorage.setItem('assignedPatients', JSON.stringify(assignedPatients));
    localStorage.setItem('availableIds', JSON.stringify(availableIds));

    // Update the UI
    displayAssignedPatients();
    displayIdPool();

    // Clear the input field
    document.getElementById('patientName').value = '';
}

// Function to add multiple IDs to the pool
function addIDToPool() {
    const newIdsInput = document.getElementById('newIds').value.trim();
    if (!newIdsInput) {
        alert('Please enter valid IDs.');
        return;
    }

    // Split the input by commas or spaces and filter out any empty strings
    const newIds = newIdsInput.split(/[\s,]+/).filter(id => id);

    // Add each new ID to the pool if it doesn't already exist
    newIds.forEach(newId => {
        if (!availableIds.includes(newId)) {
            availableIds.push(newId);
        }
    });

    // Save the updated ID pool in localStorage
    localStorage.setItem('availableIds', JSON.stringify(availableIds));

    // Update the UI
    displayIdPool();

    // Clear the input field
    document.getElementById('newIds').value = '';
}

// Function to clear all patient names
function clearPatientData() {
    if (confirm('Are you sure you want to clear all patient names? This cannot be undone!')) {
        localStorage.removeItem('assignedPatients');
        assignedPatients = {};
        displayAssignedPatients();
    }
}

// Function to clear all IDs
function clearIdData() {
    if (confirm('Are you sure you want to clear all IDs? This cannot be undone!')) {
        localStorage.removeItem('availableIds');
        availableIds = [...idPool]; // Reset to default IDs
        displayIdPool();
    }
}

// Attach event listeners
document.getElementById('assignBtn').addEventListener('click', assignID);
document.getElementById('addIdBtn').addEventListener('click', addIDToPool);
document.getElementById('clearPatientDataBtn').addEventListener('click', clearPatientData);
document.getElementById('clearIdDataBtn').addEventListener('click', clearIdData);

// Display the patients and IDs on page load
window.onload = function() {
    displayAssignedPatients();
    displayIdPool();
};
