document.getElementById('donorForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let name = document.getElementById('name').value;
    let bloodGroup = document.getElementById('bloodGroup').value;
    let contact = document.getElementById('contact').value;
    let address = document.getElementById('address').value;
    let gistId = document.getElementById('gistId').value;
    let token = document.getElementById('token').value;

    let donors = JSON.parse(localStorage.getItem('donors')) || [];
    let newDonor = { name, bloodGroup, contact, address };
    donors.push(newDonor);
    localStorage.setItem('donors', JSON.stringify(donors));

    updateTables(donors);
    saveToGist(donors, gistId, token);
    document.getElementById('donorForm').reset();
});

document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('donorForm').reset();
});

function createTable(bloodGroup) {
    let tableContainer = document.createElement('div');
    tableContainer.className = 'tableContainer';

    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    table.appendChild(thead);
    table.appendChild(tbody);

    let headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Name</th>
        <th>Blood Group</th>
        <th>Contact Number</th>
        <th>Address</th>
        <th>Actions</th>
    `;
    thead.appendChild(headerRow);

    tableContainer.appendChild(table);

    return { tableContainer, tbody };
}

function addRowToTable(tableBody, donor, index) {
    let newRow = tableBody.insertRow();
    newRow.setAttribute('data-index', index);
    
    newRow.insertCell(0).innerText = donor.name;
    newRow.insertCell(1).innerText = donor.bloodGroup;
    newRow.insertCell(2).innerText = donor.contact;
    newRow.insertCell(3).innerText = donor.address;
    let actionsCell = newRow.insertCell(4);
    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = function() {
        deleteDonor(index, donor.gistId, donor.token);
    };
    actionsCell.appendChild(deleteButton);
}

function updateTables(donors) {
    let tablesContainer = document.getElementById('tablesContainer');
    tablesContainer.innerHTML = ''; // Clear existing tables

    let groupedDonors = donors.reduce((groups, donor, index) => {
        if (!groups[donor.bloodGroup]) {
            groups[donor.bloodGroup] = { tableBody: null, index: [] };
        }
        if (!groups[donor.bloodGroup].tableBody) {
            let { tableContainer, tbody } = createTable(donor.bloodGroup);
            tablesContainer.appendChild(tableContainer);
            groups[donor.bloodGroup].tableBody = tbody;
        }
        groups[donor.bloodGroup].index.push(index);
        return groups;
    }, {});

    for (const [bloodGroup, { tableBody, index }] of Object.entries(groupedDonors)) {
        index.forEach(idx => addRowToTable(tableBody, donors[idx], idx));
    }
}

function deleteDonor(index, gistId, token) {
    let donors = JSON.parse(localStorage.getItem('donors')) || [];
    donors.splice(index, 1);
    localStorage.setItem('donors', JSON.stringify(donors));

    updateTables(donors);
    saveToGist(donors, gistId, token);
}

function saveToGist(donors, gistId, token) {
    fetch(https://api.github.com/gists/${gistId}, {
        method: 'PATCH',
        headers: {
            'Authorization': token ${token},
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            files: {
                'donors.json': {
                    content: JSON.stringify(donors, null, 2)
                }
            }
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Gist updated:', data);
    })
    .catch(error => {
        console.error('Error updating Gist:', error);
    });
}

window.onload = function() {
    let gistId = prompt('Enter GitHub Gist ID:');
    let token = prompt('Enter GitHub Access Token:');
    fetch(https://api.github.com/gists/${gistId}, {
        headers: {
            'Authorization': token ${token}
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        let donors = JSON.parse(data.files['donors.json'].content);
        localStorage.setItem('donors', JSON.stringify(donors));
        updateTables(donors);
    })
    .catch(error => {
        console.error('Error fetching Gist:', error);
    });
};
