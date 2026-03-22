let products = [];

async function loadProducts() {
  const data = await queue(urlProducts, get);
  products = Array.isArray(data) ? data : [];
  displayProducts();
  fillProductSelect();
}

async function getAllProducts(){
  await loadProducts();
}

async function getFindByIdProduct(){
  const id = document.getElementById("idFilter").value;
  const product = await queue(urlProducts + "/" + id, get);
  products = product ? [product] : [];
  displayProducts();
}

function getNextProductId() {
  const maxId = products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
  return (maxId + 1).toString();
}

function displayProducts() {
  const container = document.getElementById("productsContainer") || document.getElementById("container");
  if (!container) return;
  container.innerHTML = "";
  products.forEach(product => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.nombre}</td>
      <td>${product.precio}</td>
      <td>${product.stock}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="openEditProductModal('${product.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">Borrar</button>
      </td>
    `;
    container.insertBefore(row, container.firstChild);
  });
}

async function createProductEntry(product) {
  await queue(urlProducts, post, product);
  await loadProducts();
}

async function openEditProductModal(id) {
  const product = products.find(p => p.id == id);
  if (!product) return;

  document.getElementById("editProductId").value = product.id;
  document.getElementById("editProductName").value = product.nombre;
  document.getElementById("editProductPrice").value = product.precio;
  document.getElementById("editProductStock").value = product.stock;
  document.getElementById("editModal").style.display = "block";
}

async function updateProductEntry(id, product) {
  await queue(`${urlProducts}/${id}`, put, product);
  await loadProducts();
}

function setupProductModalHandlers() {
  const modal = document.getElementById("editModal");
  if (!modal) return;
  const span = modal.querySelector(".close");
  span.onclick = () => { modal.style.display = "none"; };
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
}

async function deleteProduct(id) {
  if (confirm('¿Estás seguro de que quieres borrar este producto?')) {
    await queue(`${urlProducts}/${id}`, 'DELETE');
    await loadProducts();
  }
}

function fillProductSelect() {
  const select = document.getElementById("productSelect");
  if (!select) return;
  select.innerHTML = "";

  if (products.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Sin productos";
    select.appendChild(option);
    return;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecciona un producto";
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  products.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.nombre} (Stock: ${p.stock})`;
    select.appendChild(option);
  });
}

function updateStockInfo() {
  const select = document.getElementById("productSelect");
  const stockSpan = document.getElementById("productStockInfo");
  const quantityInput = document.getElementById("orderQuantity");
  const totalSpan = document.getElementById("orderTotal");

  if (!select || !stockSpan || !quantityInput || !totalSpan) return;

  const selectedId = select.value;
  const product = products.find(p => p.id == selectedId);
  if (!product) {
    stockSpan.textContent = "Stock: -";
    totalSpan.textContent = "Total: -";
    return;
  }

  stockSpan.textContent = `Stock disponible: ${product.stock}`;
  const quantity = Number(quantityInput.value) || 0;
  const total = (quantity > 0 ? quantity * product.precio : 0).toFixed(2);
  totalSpan.textContent = `Total: $${total}`;

  if (product.stock <= 0) {
    select.querySelector('option[value="' + product.id + '"]').textContent = `${product.nombre} (Sin stock)`;
  }
}

if (document.getElementById("productForm")) {
  document.getElementById("productId").closest('.form-group').style.display = 'none';

  document.getElementById("productForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const product = {
      id: getNextProductId(),
      nombre: document.getElementById("productName").value,
      precio: parseFloat(document.getElementById("productPrice").value),
      stock: parseInt(document.getElementById("productStock").value, 10)
    };

    await createProductEntry(product);
    this.reset();
  });

  document.getElementById("editProductForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const id = document.getElementById("editProductId").value;
    const product = {
      nombre: document.getElementById("editProductName").value,
      precio: parseFloat(document.getElementById("editProductPrice").value),
      stock: parseInt(document.getElementById("editProductStock").value, 10)
    };

    await updateProductEntry(id, product);
    document.getElementById("editModal").style.display = "none";
  });

  setupProductModalHandlers();
  loadProducts();
} else if (document.getElementById("indexProductSection")) {
  loadProducts();
}

