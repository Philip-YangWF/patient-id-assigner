// Pool of existing IDs (default)
let idPool = [];

// Load assigned patient data from localStorage
let assignedPatients = JSON.parse(localStorage.getItem('assignedPatients')) || {};

// Load remaining IDs from localStorage or use the default pool
let availableIds = JSON.parse(localStorage.getItem('availableIds')) || [...idPool];

// Function to display the list of assigned patients
function displayAssignedPatients() {
    const patientList = document.getElementById('patientList');
    patientList.innerHTML = '';

    for (let patient in assignedPatients) {
        const listItem = document.createElement('li');
        listItem.textContent = `${patient}: ${assignedPatients[patient]}`;
        patientList.appendChild(listItem);
    }
}

// Function to display the list of available IDs in the pool
function displayIdPool() {
    const idPoolList = document.getElementById('idPoolList');
    idPoolList.innerHTML = '';

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
        showMessage('Please enter a valid patient name.', 'error');
        return;
    }

    if (assignedPatients[patientName]) {
        showMessage(`Patient ${patientName} already has an ID assigned: ${assignedPatients[patientName]}`, 'error');
        return;
    }

    if (availableIds.length === 0) {
        showMessage('No more IDs available in the pool.', 'error');
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

    // Show success message
    showMessage(`Successfully assigned ID ${assignedId} to patient ${patientName}.`, 'success');

    // Clear the input field and disable the assign button
    document.getElementById('patientName').value = '';
    document.getElementById('assignBtn').disabled = true;
}

// Function to add multiple IDs to the pool
function addIDToPool() {
    const newIdsInput = document.getElementById('newIds').value.trim();
    if (!newIdsInput) {
        showMessage('Please enter valid IDs.', 'error');
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

    // Show success message
    showMessage('IDs successfully added to the pool.', 'success');

    // Clear the input field
    document.getElementById('newIds').value = '';
}

// Function to clear all patient names
function clearPatientData() {
    if (confirm('Are you sure you want to clear all patient names? This cannot be undone!')) {
        localStorage.removeItem('assignedPatients');
        assignedPatients = {};
        displayAssignedPatients();
        showMessage('All patient names have been cleared.', 'success');
    }
}

// Function to clear all IDs
function clearIdData() {
    if (confirm('Are you sure you want to clear all IDs? This cannot be undone!')) {
        localStorage.removeItem('availableIds');
        availableIds = [...idPool];
        displayIdPool();
        showMessage('All IDs have been cleared.', 'success');
    }
}

// Function to show a message in the message box
function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;

    // Set the message type (success or error)
    messageBox.className = `message-box ${type}`;

    // Automatically hide the message after 3 seconds
    setTimeout(() => {
        messageBox.textContent = '';
        messageBox.className = 'message-box';
    }, 3000);
}

// Attach event listeners
document.getElementById('assignBtn').addEventListener('click', assignID);
document.getElementById('addIdBtn').addEventListener('click', addIDToPool);
document.getElementById('clearPatientDataBtn').addEventListener('click', clearPatientData);
document.getElementById('clearIdDataBtn').addEventListener('click', clearIdData);
document.getElementById('patientName').addEventListener('input', function() {
    document.getElementById('assignBtn').disabled = !this.value.trim();
});

// Display the patients and IDs on page load
window.onload = function() {
    displayAssignedPatients();
    displayIdPool();
};
