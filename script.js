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

    addRowToTable(newDonor, donors.length - 1);
    document.getElementById('donorForm').reset();
});

document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('donorForm').reset();
});

function addRowToTable(donor, index) {
    let table = document.getElementById('donorTable').getElementsByTagName('tbody')[0];
    let newRow = table.insertRow();
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

function deleteDonor(index) {
    let donors = JSON.parse(localStorage.getItem('donors')) || [];
    donors.splice(index, 1);
    localStorage.setItem('donors', JSON.stringify(donors));

    let table = document.getElementById('donorTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    donors.forEach((donor, index) => addRowToTable(donor, index));
}

window.onload = function() {
    let donors = JSON.parse(localStorage.getItem('donors')) || [];
    donors.forEach((donor, index) => addRowToTable(donor, index));
};