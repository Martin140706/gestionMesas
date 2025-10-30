const menuComidas = [
  { id: 1, nombre: '🍕 Pizza Margarita', precio: 12.5 },
  { id: 2, nombre: '🍔 Hamburguesa Completa', precio: 10.0 },
  { id: 3, nombre: '🍝 Pasta Carbonara', precio: 14.0 },
  { id: 4, nombre: '🥗 Ensalada César', precio: 8.5 },
  { id: 5, nombre: '🍗 Pollo al Horno', precio: 15.0 },
  { id: 6, nombre: '🥩 Bife de Chorizo', precio: 18.0 },
  { id: 7, nombre: '🍤 Camarones al Ajillo', precio: 16.5 },
  { id: 8, nombre: '🍰 Tarta de Chocolate', precio: 6.0 },
  { id: 9, nombre: '🥤 Bebida', precio: 3.0 },
  { id: 10, nombre: '☕ Café', precio: 2.5 },
];

const mesas = [
  { id: 1, status: 'disponible', pedido: [] },
  { id: 2, status: 'disponible', pedido: [] },
  { id: 3, status: 'ocupada', pedido: [] },
  { id: 4, status: 'reservada', pedido: [] },
  { id: 5, status: 'ocupada', pedido: [] },
  { id: 6, status: 'disponible', pedido: [] },
  { id: 7, status: 'reservada', pedido: [] },
  { id: 8, status: 'ocupada', pedido: [] },
  { id: 9, status: 'reservada', pedido: [] },
  { id: 10, status: 'disponible', pedido: [] },
];

let mesaActual = null;

function calcularTotal(pedido) {
  return pedido.reduce((total, item) => total + item.precio, 0);
}

function mostrarMesas() {
  const grid = document.getElementById('tablesGrid');
  grid.innerHTML = '';

  mesas.forEach((mesa) => {
    const tarjeta = document.createElement('div');
    tarjeta.className = `tarjetaMesa ${mesa.status}`;
    tarjeta.onclick = () => abrirModal(mesa);

    const textoEstado = {
      disponible: 'Disponible',
      ocupada: 'Ocupada',
      reservada: 'Reservada',
    };

    const total = calcularTotal(mesa.pedido);
    const totalHTML =
      mesa.status === 'ocupada' && total > 0
        ? `<div class="totalMesa">💵 $${total.toFixed(2)}</div>`
        : '';

    tarjeta.innerHTML = `
                    <div class="iconoMesa">🪑</div>
                    <div class="numeroMesa">Mesa ${mesa.id}</div>
                    <div class="estadoMesa">${textoEstado[mesa.status]}</div>
                    ${totalHTML}
                `;

    grid.appendChild(tarjeta);
  });

  actualizarEstadisticas();
}

function actualizarEstadisticas() {
  const disponibles = mesas.filter((m) => m.status === 'disponible').length;
  const ocupadas = mesas.filter((m) => m.status === 'ocupada').length;
  const reservadas = mesas.filter((m) => m.status === 'reservada').length;

  document.getElementById('disponibles').textContent = disponibles;
  document.getElementById('ocupadas').textContent = ocupadas;
  document.getElementById('reservadas').textContent = reservadas;
}

function agregarComida(comida) {
  if (mesaActual && mesaActual.status === 'ocupada') {
    const mesa = mesas.find((m) => m.id === mesaActual.id);
    mesa.pedido.push({ ...comida });
    abrirModal(mesa);
  }
}

function eliminarComida(index) {
  if (mesaActual) {
    const mesa = mesas.find((m) => m.id === mesaActual.id);
    mesa.pedido.splice(index, 1);
    abrirModal(mesa);
  }
}

function abrirModal(mesa) {
  mesaActual = mesa;
  const modal = document.getElementById('modal');
  const tituloModal = document.getElementById('tituloModal');
  const contenidoDinamico = document.getElementById('contenidoDinamico');
  const botonModal = document.getElementById('botonModal');

  tituloModal.textContent = `Mesa #${mesa.id}`;
  contenidoDinamico.innerHTML = '';

  if (mesa.status === 'ocupada') {
    const total = calcularTotal(mesa.pedido);

    contenidoDinamico.innerHTML = `
                    <div class="seccionPedido">
                        <h3>🍽️ Agregar Comidas</h3>
                        <div class="menuComidas" id="menuComidas"></div>
                    </div>
                    
                    <div class="seccionPedido">
                        <h3>📝 Pedido Actual</h3>
                        <div class="listaPedido" id="listaPedido"></div>
                        ${
                          total > 0
                            ? `<div class="totalPedido">Total: $${total.toFixed(
                                2,
                              )}</div>`
                            : ''
                        }
                    </div>
                `;

    const menuDiv = document.getElementById('menuComidas');
    menuComidas.forEach((comida) => {
      const item = document.createElement('div');
      item.className = 'itemComida';
      item.onclick = () => agregarComida(comida);
      item.innerHTML = `
                        <div class="itemComidaInfo">
                            <span>${comida.nombre}</span>
                        </div>
                        <div class="itemComidaPrecio">$${comida.precio.toFixed(
                          2,
                        )}</div>
                    `;
      menuDiv.appendChild(item);
    });

    const listaPedidoDiv = document.getElementById('listaPedido');
    if (mesa.pedido.length === 0) {
      listaPedidoDiv.innerHTML =
        '<div class="pedidoVacio">No hay pedidos aún</div>';
    } else {
      mesa.pedido.forEach((item, index) => {
        const pedidoItem = document.createElement('div');
        pedidoItem.className = 'itemPedido';
        pedidoItem.innerHTML = `
                            <span class="itemPedidoNombre">${item.nombre}</span>
                            <div>
                                <span class="itemPedidoPrecio">$${item.precio.toFixed(
                                  2,
                                )}</span>
                                <button class="btnEliminar" onclick="eliminarComida(${index})">✕</button>
                            </div>
                        `;
        listaPedidoDiv.appendChild(pedidoItem);
      });
    }

    botonModal.innerHTML = `
                    <button class="btn btn-success" onclick="cambiarEstado('disponible')">Liberar y Cobrar</button>
                    <button class="btn btn-secondary" onclick="cerrarModal()">Cerrar</button>
                `;
  } else {
    let buttons = '';

    if (mesa.status === 'disponible') {
      buttons = `
                        <button class="btn btn-danger" onclick="cambiarEstado('ocupada')">Ocupar</button>
                        <button class="btn btn-warning" onclick="cambiarEstado('reservada')">Reservar</button>
                        <button class="btn btn-secondary btn-full" onclick="cerrarModal()">Cancelar</button>
                    `;
    } else if (mesa.status === 'reservada') {
      buttons = `
                        <button class="btn btn-danger" onclick="cambiarEstado('ocupada')">Ocupar</button>
                        <button class="btn btn-success" onclick="cambiarEstado('disponible')">Liberar</button>
                        <button class="btn btn-secondary btn-full" onclick="cerrarModal()">Cancelar</button>
                    `;
    }

    botonModal.innerHTML = buttons;
  }

  modal.classList.add('active');
}

function cerrarModal() {
  document.getElementById('modal').classList.remove('active');
  mostrarMesas();
}

function cambiarEstado(nuevoEstado) {
  if (mesaActual) {
    const mesa = mesas.find((m) => m.id === mesaActual.id);

    if (mesa.status === 'ocupada' && nuevoEstado === 'disponible') {
      const total = calcularTotal(mesa.pedido);
      if (total > 0) {
        alert(
          `💵 Total a cobrar: $${total.toFixed(2)}\n¡Gracias por su visita!`,
        );
      }
      mesa.pedido = [];
    }

    mesa.status = nuevoEstado;
    mostrarMesas();
    cerrarModal();
  }
}

window.onclick = function (event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    cerrarModal();
  }
};

mostrarMesas();
