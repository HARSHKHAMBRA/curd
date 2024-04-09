const fetchData = async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    const dataElement = document.getElementById('data');
    dataElement.innerHTML = ''; // Clear previous data
    data.forEach(item => {
        const div = document.createElement('div');
        div.textContent = `${item.id}: ${item.name} - ${item.description}`;
        
        // Add edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            editData(item.id, item.name, item.description);
        });

        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteData(item.id);
        });

        div.appendChild(editButton);
        div.appendChild(deleteButton);
        dataElement.appendChild(div);
    });
};

const editData = async (id, name, description) => {
    const newName = prompt('Enter new name:', name);
    const newDescription = prompt('Enter new description:', description);
    if (newName !== null && newDescription !== null) {
        const response = await fetch(`/api/data/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName, description: newDescription })
        });
        if (response.ok) {
            fetchData();
        } else {
            alert('Failed to update data');
        }
    }
};

const deleteData = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this data?');
    if (confirmDelete) {
        const response = await fetch(`/api/data/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchData();
        } else {
            alert('Failed to delete data');
        }
    }
};

document.getElementById('createForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
    });
    if (response.ok) {
        fetchData();
        document.getElementById('name').value = '';
        document.getElementById('description').value = '';
    } else {
        alert('Failed to create data');
    }
});

fetchData();
