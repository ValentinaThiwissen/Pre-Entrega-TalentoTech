  const botonesAgregar = document.querySelectorAll('.boton-agregar');
  const carritoIcono = document.getElementById('carrito');
  const resumenCarrito = document.getElementById('resumen-carrito');
  const productosCarritoDiv = document.getElementById('productos-carrito');
  const totalCarritoSpan = document.getElementById('total-carrito');
  const cantidadCarritoSpan = document.getElementById('cantidad-carrito');
  const cerrarCarritoBtn = document.getElementById('cerrar-carrito');
  const comprarCarritoBtn = document.getElementById('comprar-carrito');
  const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

  // Estado carrito
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Guardar en localStorage
  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  // Actualizar contador carrito
  function actualizarCantidadCarrito() {
    const cantidad = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    cantidadCarritoSpan.textContent = cantidad;
  }

  // Renderizar carrito con botones + y -
  function renderizarCarrito() {
    productosCarritoDiv.innerHTML = '';
    if (carrito.length === 0) {
      productosCarritoDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
      totalCarritoSpan.textContent = '0';
      return;
    }
    let total = 0;
    carrito.forEach((prod, index) => {
      total += prod.precio * prod.cantidad;
      const prodDiv = document.createElement('div');
      prodDiv.classList.add('producto-carrito');
      prodDiv.style.display = 'flex';
      prodDiv.style.justifyContent = 'space-between';
      prodDiv.style.alignItems = 'center';
      prodDiv.style.marginBottom = '8px';

      prodDiv.innerHTML = `
        <span style="flex:1;">${prod.nombre}</span>
        <div style="display:flex; align-items:center; gap:5px;">
          <button class="btn-cantidad" data-index="${index}" data-action="menos">-</button>
          <span>${prod.cantidad}</span>
          <button class="btn-cantidad" data-index="${index}" data-action="mas">+</button>
        </div>
        <span style="width:60px; text-align:right;">$${(prod.precio * prod.cantidad).toFixed(2)}</span>
        <button class="btn-eliminar" data-index="${index}" style="background:none; border:none; color:#ff4da6; font-weight:bold; cursor:pointer;">X</button>
      `;
      productosCarritoDiv.appendChild(prodDiv);
    });
    totalCarritoSpan.textContent = total.toFixed(2);
  }

  // Agregar producto al carrito
  function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(prod => prod.nombre === nombre);
    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }
    guardarCarrito();
    actualizarCantidadCarrito();
    renderizarCarrito();
  }

  // Actualizar cantidad (mas o menos)
  function actualizarCantidad(index, accion) {
    if (accion === 'mas') {
      carrito[index].cantidad += 1;
    } else if (accion === 'menos') {
      carrito[index].cantidad -= 1;
      if (carrito[index].cantidad < 1) {
        carrito.splice(index, 1);
      }
    }
    guardarCarrito();
    actualizarCantidadCarrito();
    renderizarCarrito();
  }

  // Vaciar carrito
  function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarCantidadCarrito();
    renderizarCarrito();
  }

  // Evento para agregar productos
  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', () => {
      const productoElem = boton.parentElement;
      const nombre = productoElem.querySelector('h4').textContent;
      const precioText = productoElem.querySelector('p').textContent.replace('$', '').trim();
      const precio = parseFloat(precioText);
      agregarAlCarrito(nombre, precio);
      alert(`Se agregó "${nombre}" al carrito.`);
    });
  });

  // Mostrar/ocultar resumen carrito
  carritoIcono.addEventListener('click', () => {
    if (resumenCarrito.style.display === 'none' || resumenCarrito.style.display === '') {
      renderizarCarrito();
      resumenCarrito.style.display = 'block';
    } else {
      resumenCarrito.style.display = 'none';
    }
  });

  // Cerrar carrito
  cerrarCarritoBtn.addEventListener('click', () => {
    resumenCarrito.style.display = 'none';
  });

  // Vaciar carrito botón
  vaciarCarritoBtn.addEventListener('click', () => {
    if(confirm('¿Querés vaciar el carrito?')) {
      vaciarCarrito();
    }
  });

  // Comprar carrito botón
  comprarCarritoBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío, no hay nada para comprar.');
      return;
    }
    alert('¡Compra realizada con éxito! Muchas gracias por tu compra.');
    vaciarCarrito();
    resumenCarrito.style.display = 'none';
  });

  // Manejo de botones +, -, eliminar dentro del carrito
  productosCarritoDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-cantidad')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      const accion = e.target.getAttribute('data-action');
      actualizarCantidad(index, accion);
    } else if (e.target.classList.contains('btn-eliminar')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      carrito.splice(index, 1);
      guardarCarrito();
      actualizarCantidadCarrito();
      renderizarCarrito();
    }
  });

  // Inicializar contador carrito al cargar página
  actualizarCantidadCarrito();
