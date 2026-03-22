let users = [];

async function loadUsers() {
  const data = await queue(urlUsers, get);
  users = Array.isArray(data) ? data : [];
  displayUsers();
}

async function getAllUsers() {
  await loadUsers();
}

async function getFindByIdUser() {
  const id = document.getElementById("idFilter").value;
  const user = await queue(urlUsers + "/" + id, get);
  users = user ? [user] : [];
  displayUsers();
}

function displayUsers() {
  const container = document.getElementById("usersContainer");
  if (!container) return;
  container.innerHTML = "";
  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.nombre}</td>
      <td>${user.apellido}</td>
      <td>${user.correo}</td>
      <td>${user.telefono}</td>
      <td>${user.edad}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="openEditUserModal('${user.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">Borrar</button>
      </td>
    `;
    container.insertBefore(row, container.firstChild);
  });
}

function getNextUserId() {
  const maxId = users.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0);
  return (maxId + 1).toString();
}

async function createUserEntry(user) {
  await queue(urlUsers, post, user);
  await loadUsers();
}

async function openEditUserModal(id) {
  const user = users.find(u => u.id == id);
  if (!user) return;

  document.getElementById("editUserId").value = user.id;
  document.getElementById("editUserName").value = user.nombre;
  document.getElementById("editUserLastName").value = user.apellido;
  document.getElementById("editUserEmail").value = user.correo;
  document.getElementById("editUserPhone").value = user.telefono;
  document.getElementById("editUserAge").value = user.edad;
  document.getElementById("editUserProduct").value = user.producto || "";
  document.getElementById("editUserQuantity").value = user.cantidad || "";

  document.getElementById("editModal").style.display = "block";
}

async function updateUserEntry(id, user) {
  await queue(`${urlUsers}/${id}`, put, user);
  await loadUsers();
}

function setupUserModalHandlers() {
  const modal = document.getElementById("editModal");
  if (!modal) return;
  const span = modal.querySelector(".close");
  span.onclick = () => { modal.style.display = "none"; };
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
}

async function deleteUser(id) {
  if (confirm('¿Estás seguro de que quieres borrar este usuario?')) {
    await queue(`${urlUsers}/${id}`, 'DELETE');
    await loadUsers();
  }
}

if (document.getElementById("userForm")) {
  document.getElementById("userId").closest('.form-group').style.display = 'none';

  document.getElementById("userForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const user = {
      id: getNextUserId(),
      nombre: document.getElementById("userName").value,
      apellido: document.getElementById("userLastName").value,
      correo: document.getElementById("userEmail").value,
      telefono: document.getElementById("userPhone").value,
      edad: parseInt(document.getElementById("userAge").value, 10),
      producto: "",
      cantidad: 0,
      total: 0
    };

    await createUserEntry(user);
    this.reset();
  });

  document.getElementById("editUserForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const id = document.getElementById("editUserId").value;
    const user = {
      nombre: document.getElementById("editUserName").value,
      apellido: document.getElementById("editUserLastName").value,
      correo: document.getElementById("editUserEmail").value,
      telefono: document.getElementById("editUserPhone").value,
      edad: parseInt(document.getElementById("editUserAge").value, 10),
      producto: document.getElementById("editUserProduct").value,
      cantidad: parseInt(document.getElementById("editUserQuantity").value, 10),
      total: parseFloat(document.getElementById("editUserTotal").value)
    };

    await updateUserEntry(id, user);
    document.getElementById("editModal").style.display = "none";
  });

  setupUserModalHandlers();
  loadUsers();
} else if (document.getElementById("indexUserTable")) {
  loadUsers();
};