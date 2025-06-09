// index.js
const args = process.argv.slice(2); // Ej: ["POST", "products", "Remera", "300", "ropa"]
const [method, resource, ...rest] = args;

const BASE_URL = "https://fakestoreapi.com";

async function main() {
  if (method === "GET") {
    if (resource === "products") {
      // GET all products
      try {
        const res = await fetch(`${BASE_URL}/products`);
        const data = await res.json();
        console.log("📦 Lista de productos:");
        data.forEach((product) => {
          console.log(`- ${product.title} ($${product.price})`);
        });
      } catch (error) {
        console.error("❌ Error al obtener productos:", error.message);
      }
    } else if (resource.startsWith("products/")) {
      // GET one product
      const productId = resource.split("/")[1];
      try {
        const res = await fetch(`${BASE_URL}/products/${productId}`);
        if (!res.ok)
          throw new Error(`Producto con ID ${productId} no encontrado`);
        const product = await res.json();
        console.log("📦 Producto encontrado:");
        console.log(product);
      } catch (error) {
        console.error("❌ Error al obtener producto:", error.message);
      }
    } else {
      console.log("❓ Ruta no reconocida.");
    }
  } else if (method === "POST" && resource === "products") {
    // POST new product
    const [title, priceStr, category] = rest;
    const price = parseFloat(priceStr);

    if (!title || isNaN(price) || !category) {
      console.error("❌ Parámetros inválidos. Usa:");
      console.log("npm run start POST products <title> <price> <category>");
      return;
    }

    const newProduct = {
      title,
      price,
      description: "Producto generado desde terminal",
      image: "https://i.pravatar.cc", // Fake image
      category,
    };

    try {
      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        body: JSON.stringify(newProduct),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("✅ Producto creado:");
      console.log(data);
    } catch (error) {
      console.error("❌ Error al crear producto:", error.message);
    }
  } else if (method === "DELETE" && resource.startsWith("products/")) {
    // DELETE product
    const productId = resource.split("/")[1];
    try {
      const res = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(`🗑 Producto con ID ${productId} eliminado:`);
      console.log(data);
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error.message);
    }
  } else {
    console.log("❓ Comando no reconocido. Usa:");
    console.log("npm run start GET products");
    console.log("npm run start GET products/<id>");
    console.log("npm run start POST products <title> <price> <category>");
    console.log("npm run start DELETE products/<id>");
  }
}

main();
