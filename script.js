document.addEventListener('DOMContentLoaded', () => {
    // --- Funcionalidad "Ver Más Productos" ---
    const showMoreButtons = document.querySelectorAll('.show-more-btn');
    const productsPerClick = 4; // Cuántos productos se muestran cada vez que se hace clic

    showMoreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que el enlace recargue la página
            const category = button.dataset.category; // Obtiene la categoría del botón (ej. "accesorios")
            const productGrid = document.getElementById(`${category}-grid`);
            
            // Si el productGrid no existe, sal de la función
            if (!productGrid) {
                console.error(`Grid con id ${category}-grid no encontrado.`);
                return;
            }

            // Seleccionar solo los productos que tienen la clase 'hidden-product'
            const hiddenProducts = productGrid.querySelectorAll('.product-card.hidden-product');
            let productsShown = 0;

            // Iterar sobre los productos ocultos y mostrarlos
            for (let i = 0; i < hiddenProducts.length; i++) {
                if (productsShown < productsPerClick) {
                    hiddenProducts[i].classList.remove('hidden-product');
                    hiddenProducts[i].classList.add('visible'); // Añade clase visible para transición CSS
                    productsShown++;
                } else {
                    break; // Deja de mostrar si ya alcanzamos el límite por clic
                }
            }

            // Ocultar el botón si ya no hay más productos ocultos
            const remainingHiddenProducts = productGrid.querySelectorAll('.product-card.hidden-product').length;
            if (remainingHiddenProducts === 0) {
                button.style.display = 'none'; // Oculta el botón "Ver Más"
            }
        });
    });

    // --- Funcionalidad de Carrito de Compras (Simulación) ----
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartItemCountSpan = document.getElementById('cart-item-count');
    const cartTotalSpan = document.getElementById('cart-total');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = []; // Array para almacenar los productos en el carrito

    // Función para actualizar la interfaz del carrito
    function updateCartUI() {
        cartItemsList.innerHTML = ''; // Limpiar la lista actual
        let total = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li>El carrito está vacío.</li>';
            checkoutBtn.disabled = true; // Deshabilitar el botón de pago si no hay ítems
        } else {
            checkoutBtn.disabled = false; // Habilitar el botón de pago
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="item-info">${item.name} (x${item.quantity})</span>
                    <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item-btn" data-index="${index}">X</button>
                `;
                cartItemsList.appendChild(li);
                total += item.price * item.quantity;
            });
        }

        // Actualizar el contador de ítems en el botón del carrito
        const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCountSpan.textContent = totalItemsInCart;
        cartTotalSpan.textContent = `$${total.toFixed(2)}`;
    }

    // Añadir producto al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productName = e.target.dataset.name;
            const productPrice = parseFloat(e.target.dataset.price);

            const existingItem = cart.find(item => item.name === productName);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: productName, price: productPrice, quantity: 1 });
            }
            updateCartUI();
            // Opcional: mostrar una notificación más sutil o animar el botón del carrito
            // alert(`${productName} ha sido añadido al carrito.`); 
        });
    });

    // Eliminar producto del carrito
    cartItemsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const indexToRemove = parseInt(e.target.dataset.index);
            cart.splice(indexToRemove, 1); // Eliminar el elemento del array
            updateCartUI();
        }
    });

    // Toggle (mostrar/ocultar) el carrito flotante
    cartToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el clic se propague al documento y cierre el carrito
        cartDropdown.classList.toggle('active');
    });

    // Cerrar el carrito si se hace clic fuera de él
    document.addEventListener('click', (e) => {
        // Si el clic no fue dentro del carrito ni en el botón de alternar el carrito, ciérralo
        if (!cartDropdown.contains(e.target) && !cartToggleBtn.contains(e.target)) {
            cartDropdown.classList.remove('active');
        }
    });

    // Simulación de proceso de pago
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Por favor, añade productos para proceder al pago.');
            return;
        }
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
        alert(`Simulación de pago:\nTotal a pagar: $${total}\n\n¡Gracias por tu compra virtual!`);
        cart = []; // Vaciar el carrito después del "pago"
        updateCartUI();
        cartDropdown.classList.remove('active'); // Ocultar el carrito
    });

    // Inicializar la UI del carrito al cargar la página
    updateCartUI();
});