const API_URL = "https://dummyjson.com/products";

// Fetch all products
export async function getProducts() {
    try {
        const response = await fetch(`${API_URL}?limit=100`);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        return data.products;

    } catch (error) {
        console.error("Product API Error:", error);

        throw new Error(
            "Unable to load products. Please check your internet connection."
        );
    }
}


// Fetch categories
export async function getCategories() {
    try {
        const response = await fetch(
            "https://dummyjson.com/products/categories"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        const categories = await response.json();

        // Supports both string and object category formats
        return categories.map(category =>
            typeof category === "string" ?
            category :
            category.slug
        );

    } catch (error) {
        console.error("Category API Error:", error);

        throw new Error("Unable to load categories.");
    }
}