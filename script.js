document.getElementById('donorForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let name = document.getElementById('name').value;
    let bloodGroup = document.getElementById('bloodGroup').value;
    let contact = document.getElementById('contact').value;
    let address = document.getElementById('address').value;

    let donors = JSON.parse(localStorage.getItem('donors')) || [];
    let newDonor = { name, bloodGroup, contact, address };
    donors.push(newDonor);
    localStorage.setItem('donors', JSON.stringify(donors));

    updateTables(donors);
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
        deleteDonor(index);
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

function deleteDonor(index) {
    let donors = JSON.parse(localStorage.getItem('donors')) || [];
    donors.splice(index, 1);
    localStorage.setItem('donors', JSON.stringify(donors));

    updateTables(donors);
}

window.onload = function() {
    let donors = JSON.parse(localStorage.getItem('donors')) || [];
    updateTables(donors);
};
