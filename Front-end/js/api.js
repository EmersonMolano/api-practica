// Función genérica para hacer peticiones a la API
async function queue(url, method, body = null) {
    try {
        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en la petición:", error);
        return null;
    }
}

// 🔍 GET - Obtener todos los usuarios
async function getUsers() {
    const response = await fetch(urlBase);
    const data = await response.json();
    return data;
}

// 🔍 GET por ID
async function getUserById(id) {
    const response = await fetch(`${urlBase}/${id}`);
    return await response.json();
}

// ➕ POST - Crear usuario
async function createUser(user) {
    const response = await fetch(urlBase + "add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    return await response.json();
}

// ✏️ PUT - Actualizar usuario
async function updateUser(id, user) {
    const response = await fetch(`${urlBase}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    return await response.json();
}

// ❌ DELETE - Eliminar usuario
async function deleteUser(id) {
    const response = await fetch(`${urlBase}/${id}`, {
        method: "DELETE"
    });

    return await response.json();
}