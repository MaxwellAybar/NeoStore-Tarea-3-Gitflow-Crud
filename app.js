class Producto {
    constructor(id, nombre, precio, stock, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = parseFloat(precio);
        this.stock = parseInt(stock);
        this.categoria = categoria;
    }
}

let productos = JSON.parse(localStorage.getItem('neostore_productos')) || [];

const form = document.getElementById('producto-form');
const inputId = document.getElementById('producto-id');
const inputNombre = document.getElementById('nombre');
const inputPrecio = document.getElementById('precio');
const inputStock = document.getElementById('stock');
const selectCategoria = document.getElementById('categoria');
const btnGuardar = document.getElementById('btn-guardar');
const listaProductos = document.getElementById('lista-productos');

function renderizarProductos() {
    listaProductos.innerHTML = '';

    if (productos.length === 0) {
        listaProductos.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">No hay productos registrados en NeoStore.</td>
            </tr>
        `;
        return;
    }

    productos.forEach(prod => {
        const precioNum = Number(prod.precio) || 0;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${prod.id}</td>
            <td><strong>${prod.nombre}</strong></td>
            <td>$${precioNum.toFixed(2)}</td>
            <td>${prod.stock} unids.</td>
            <td><span class="badge">${prod.categoria}</span></td>
            <td>
                <button onclick="prepararEdicion(${prod.id})" class="btn-action edit">Editar</button>
                <button onclick="eliminarProducto(${prod.id})" class="btn-action delete">Eliminar</button>
            </td>
        `;
        listaProductos.appendChild(tr);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = inputId.value;
    const nombre = inputNombre.value.trim();
    const precio = inputPrecio.value;
    const stock = inputStock.value;
    const categoria = selectCategoria.value;

    if (id) {
        const index = productos.findIndex(p => p.id == id);
        if (index !== -1) {
            productos[index] = new Producto(id, nombre, precio, stock, categoria);
        }
        btnGuardar.textContent = 'Guardar Producto';
    } else {
        const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 101;
        const nuevoProducto = new Producto(nuevoId, nombre, precio, stock, categoria);
        productos.push(nuevoProducto);
    }

    guardarEnLocalStorage();
    form.reset();
    inputId.value = '';
    renderizarProductos();
});

window.prepararEdicion = function(id) {
    const prod = productos.find(p => p.id == id);
    if (prod) {
        inputId.value = prod.id;
        inputNombre.value = prod.nombre;
        inputPrecio.value = prod.precio;
        inputStock.value = prod.stock;
        selectCategoria.value = prod.categoria;
        btnGuardar.textContent = 'Actualizar Producto';
    }
};

window.eliminarProducto = function(id) {
    if (confirm('¿Estás seguro de eliminar este producto de NeoStore?')) {
        productos = productos.filter(p => p.id != id);
        guardarEnLocalStorage();
        renderizarProductos();
    }
};

function guardarEnLocalStorage() {
    localStorage.setItem('neostore_productos', JSON.stringify(productos));
}


function buscarProducto(criterio) {
    console.log("Buscando producto por criterio:", criterio);
}

const inputBuscar = document.getElementById('input-buscar');

if (inputBuscar) {
    inputBuscar.addEventListener('input', (e) => {
        const busqueda = e.target.value.toLowerCase();
        const filas = listaProductos.querySelectorAll('tr');

        filas.forEach(fila => {
            const textoFila = fila.textContent.toLowerCase();
            if (textoFila.includes(busqueda)) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        });
    });
}

renderizarProductos();