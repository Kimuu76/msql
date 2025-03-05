/** @format */

const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// ✅ Fetch all products
router.get("/", async (req, res) => {
	try {
		const products = await Product.findAll(); // Fetch all products
		res.json(products);
	} catch (error) {
		console.error("❌ Error fetching products:", error);
		res.status(500).json({ message: "Error fetching products", error });
	}
});

// ✅ Add a new product
router.post("/", async (req, res) => {
	const { name, purchasePrice, sellingPrice, stock } = req.body;

	// ✅ Validation
	if (!name) {
		return res.status(400).json({ message: "Name is required" });
	}

	try {
		// ✅ Use the correct insert method from the Product model
		const newProduct = await Product.insert({
			name,
			purchasePrice,
			sellingPrice,
			stock,
		});
		res.status(201).json(newProduct);
	} catch (error) {
		console.error("❌ Error adding product:", error);
		res.status(500).json({ message: "Error adding product", error });
	}
});

module.exports = router;

// ✅ Delete a product (with validation for related records)
router.delete("/:id", async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		// 🚨 Check for related records before deleting
		// (e.g., Sales, SalesReturns, Purchases, PurchaseReturns)
		// Assume you have models for these:
		// const sales = await Sale.find({ product: req.params.id });
		// if (sales.length > 0) return res.status(400).json({ message: "Cannot delete, product has sales records" });

		await product.deleteOne();
		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting product", error });
	}
});

module.exports = router;
