const apiUrl = "https://striveschool-api.herokuapp.com/books";
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Funzione per aggiornare il contatore del carrello
const updateCartCounter = () => {
    document.getElementById('cartCounter').textContent = cart.length;
}

// Funzione per aggiornare la visualizzazione del carrello
const updateCartView = () => {
    const cartList = document.getElementById('cartList');
    const cartTotal = document.getElementById('cartTotal');
    
    cartList.innerHTML = '';
    let total = 0;

    cart.forEach(book => {
        total += parseFloat(book.price);
        const cartItem = document.createElement('div');
        cartItem.classList.add('card', 'bg-dark', 'border-light');
        cartItem.innerHTML = `
            <div class="card-body d-flex align-items-center gap-2">
                <img src="${book.img}" alt="${book.title}" style="width: 50px; height: 70px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="card-title mb-1">${book.title.length > 20 ? book.title.substring(0, 20) + '...' : book.title}</h6>
                    <p class="card-text mb-0">${book.price}€</p>
                </div>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart('${book.asin}')">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        `;
        cartList.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);
}

// Funzione per salvare il carrello nel localStorage
const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    updateCartView();
}

// Funzione per aggiungere un libro al carrello
const addToCart = (book) => {
    cart.push(book);
    saveCart();
}

// Funzione per rimuovere un libro dal carrello
const removeFromCart = (bookId) => {
    cart = cart.filter(book => book.asin !== bookId);
    saveCart();
}

// Funzione per ottenere i dati dall'API
const getBooks = function(){
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const appendBooks = document.querySelector(".row");
        data.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("col-12", "col-md-6", "col-lg-4", "col-xl-3", "mb-3");
            bookCard.innerHTML = `
                <div class="card book-card">
                    <img src="${book.img}" class="card-img-top rounded" alt="Copertina ${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${book.title.length > 30 ? book.title.substring(0, 30) + '...' : book.title}
                        </h5>
                        <p class="card-text fw-bold fs-5 mb-3">
                            ${book.price}€
                        </p>
                        <div class="mt-auto">
                            <button class="btn btn-success w-100 mb-2" onclick='addToCart(${JSON.stringify(book)})'>
                                Compra ora
                            </button>
                            <div class="d-flex gap-2">    
                                <button class="btn btn-danger w-50" onclick="this.closest('.col-12').remove()" title="Scarta">
                                    <i class="bi bi-trash3"></i>
                                </button>
                                <button class="btn btn-warning w-50" onclick="removeFromCart('${book.asin}')" title="Rimuovi dal carrello">
                                    <i class="bi bi-cart-x"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            appendBooks.appendChild(bookCard);
        });
    })
    .catch(error => console.log(error));
}

// Inizializza la pagina
document.addEventListener('DOMContentLoaded', () => {
    getBooks();
    updateCartCounter();
    updateCartView();
});

