import {
    getProducts,
    getCategories
} from "./api.js";


// ==============================
// STATE
// ==============================

let products = [];

let filteredProducts = [];

let currentCategory = "all";

let searchTerm = "";

let cart = JSON.parse(
    localStorage.getItem("cart")
) || [];


// ==============================
// DOM ELEMENTS
// ==============================

const productContainer =
    document.getElementById("productContainer");

const searchInput =
    document.getElementById("searchInput");

const sortSelect =
    document.getElementById("sortSelect");

const categoryButtons =
    document.getElementById("categoryButtons");

const loading =
    document.getElementById("loading");

const noProducts =
    document.getElementById("noProducts");

const errorBanner =
    document.getElementById("errorBanner");

const errorMessage =
    document.getElementById("errorMessage");

const closeError =
    document.getElementById("closeError");

const cartCount =
    document.getElementById("cartCount");


// ==============================
// INITIALIZE APP
// ==============================

async function init() {

    showLoading();

    try {

        // Fetch products from API
        products = await getProducts();

        filteredProducts = [...products];

        // Load categories
        await loadCategories();

        // Display products
        applyFilters();

        // Update cart
        updateCartCount();

    } catch (error) {

        console.error("App Error:", error);

        showError(error.message);

    } finally {

        hideLoading();

    }
}


// ==============================
// LOAD CATEGORIES
// ==============================

async function loadCategories() {

    try {

        const categories =
            await getCategories();

        categoryButtons.innerHTML = "";

        categories.forEach(category => {

            const button =
                document.createElement("button");

            button.classList.add(
                "category-btn"
            );

            button.textContent =
                formatCategory(category);

            button.dataset.category =
                category;

            categoryButtons.appendChild(
                button
            );

        });

    } catch (error) {

        console.error(
            "Category Error:",
            error
        );

        showError(error.message);

    }
}


// ==============================
// FORMAT CATEGORY
// ==============================

function formatCategory(category) {

    return category
        .replace(/-/g, " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );

}


// ==============================
// FILTER PRODUCTS
// ==============================

function applyFilters() {

    filteredProducts =
        products.filter(product => {

            const matchesSearch =
                product.title
                .toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                );

            const matchesCategory =
                currentCategory === "all" ||
                product.category ===
                currentCategory;

            return (
                matchesSearch &&
                matchesCategory
            );

        });


    // Apply sorting
    applySorting();

    // Render products
    renderProducts();

}


// ==============================
// SORT PRODUCTS
// ==============================

function applySorting() {

    const sortValue =
        sortSelect.value;


    if (sortValue === "price-low") {

        filteredProducts.sort(
            (a, b) =>
            a.price - b.price
        );

    } else if (sortValue === "price-high") {

        filteredProducts.sort(
            (a, b) =>
            b.price - a.price
        );

    } else if (sortValue === "name") {

        filteredProducts.sort(
            (a, b) =>
            a.title.localeCompare(
                b.title
            )
        );

    }

}


// ==============================
// RENDER PRODUCTS
// ==============================

function renderProducts() {

    productContainer.innerHTML = "";


    // No products
    if (filteredProducts.length === 0) {

        noProducts.classList.remove(
            "hidden"
        );

        return;

    }


    noProducts.classList.add(
        "hidden"
    );


    // Create product cards
    filteredProducts.forEach(product => {

        const card =
            document.createElement("article");

        card.classList.add(
            "product-card"
        );


        card.innerHTML = `

            <img
                src="${product.thumbnail}"
                alt="${product.title}"
                loading="lazy"
            >

            <div class="product-info">

                <p class="category">
                    ${formatCategory(
                        product.category
                    )}
                </p>

                <h3>
                    ${product.title}
                </h3>

                <p class="price">
                    $${product.price.toFixed(2)}
                </p>

                <button
                    class="add-cart"
                    data-id="${product.id}">
                    Add to Cart
                </button>

            </div>

        `;


        productContainer.appendChild(
            card
        );

    });

}


// ==============================
// ADD TO CART
// ==============================

function addToCart(productId) {

    const product =
        products.find(
            product =>
            product.id === productId
        );


    if (!product) {
        return;
    }


    cart.push(product);


    // Save cart to localStorage
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    // Update cart count
    updateCartCount();

}


// ==============================
// UPDATE CART COUNT
// ==============================

function updateCartCount() {

    cartCount.textContent =
        cart.length;

}


// ==============================
// SEARCH EVENT
// ==============================

searchInput.addEventListener(
    "input",
    event => {

        searchTerm =
            event.target.value;

        applyFilters();

    }
);


// ==============================
// SORT EVENT
// ==============================

sortSelect.addEventListener(
    "change",
    () => {

        applyFilters();

    }
);


// ==============================
// CATEGORY EVENT
// ==============================

categoryButtons.addEventListener(
    "click",
    event => {

        if (!event.target.classList
            .contains("category-btn")
        ) {
            return;
        }


        currentCategory =
            event.target.dataset.category;


        // Remove active class
        document
            .querySelectorAll(
                ".category-btn"
            )
            .forEach(button => {

                button.classList.remove(
                    "active"
                );

            });


        // Add active class
        event.target.classList.add(
            "active"
        );


        // Apply category filter
        applyFilters();

    }
);


// ==============================
// CART EVENT
// ==============================

productContainer.addEventListener(
    "click",
    event => {

        if (
            event.target.classList
            .contains("add-cart")
        ) {

            const productId =
                Number(
                    event.target.dataset.id
                );


            addToCart(productId);

        }

    }
);


// ==============================
// ERROR HANDLING
// ==============================

function showError(message) {

    errorMessage.textContent =
        message;

    errorBanner.classList.remove(
        "hidden"
    );

}


closeError.addEventListener(
    "click",
    () => {

        errorBanner.classList.add(
            "hidden"
        );

    }
);


// ==============================
// LOADING
// ==============================

function showLoading() {

    loading.classList.remove(
        "hidden"
    );

    productContainer.classList.add(
        "hidden"
    );

}


function hideLoading() {

    loading.classList.add(
        "hidden"
    );

    productContainer.classList.remove(
        "hidden"
    );

}


// ==============================
// START APPLICATION
// ==============================

init();