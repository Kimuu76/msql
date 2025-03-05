/** @format */

const express = require("express");
const router = express.Router();
const { Sales, Product } = require("../models");
const { poolPromise, sql } = require("../config/db");

//get sales
router.get("/", async (req, res) => {
	try {
		const sales = await Sales.findAll();
		/*if (!sales.length) {
			return res.status(404).json({ error: "No sales records found" });
		}*/
		res.json(sales);
	} catch (error) {
		console.error("❌ Error fetching sales:", error);
		res
			.status(500)
			.json({ error: "Failed to fetch sales", details: error.message });
	}
});

// 📌 Add a new sale
router.post("/", async (req, res) => {
	try {
		const { items } = req.body; // [{ productId, quantity }]

		if (!items || items.length === 0) {
			return res.status(400).json({ error: "No products provided" });
		}

		const pool = await poolPromise;
		let totalAmount = 0;
		let receiptItems = [];

		for (const item of items) {
			// 📌 Fetch product details
			const productQuery = `SELECT * FROM product WHERE id = @productId`;
			const productResult = await pool
				.request()
				.input("productId", sql.Int, item.productId)
				.query(productQuery);
			const product = productResult.recordset[0];

			if (!product) {
				return res
					.status(404)
					.json({ error: `Product ID ${item.productId} not found` });
			}
			if (product.stock < item.quantity) {
				return res
					.status(400)
					.json({ error: `Insufficient stock for ${product.name}` });
			}

			// 📌 Insert sale into database
			const saleQuery = `
				INSERT INTO sales (productId, productName, quantity, sellingPricePerUnit, totalAmount)
				OUTPUT INSERTED.*
				VALUES (@productId, @productName, @quantity, @sellingPricePerUnit, @totalAmount)
			`;
			const saleResult = await pool
				.request()
				.input("productId", sql.Int, item.productId)
				.input("productName", sql.NVarChar, product.name)
				.input("quantity", sql.Int, item.quantity)
				.input("sellingPricePerUnit", sql.Float, product.sellingPrice)
				.input("totalAmount", sql.Float, product.sellingPrice * item.quantity)
				.query(saleQuery);
			const sale = saleResult.recordset[0];

			totalAmount += sale.totalAmount;
			receiptItems.push({
				productName: product.name,
				quantity: item.quantity,
				price: product.sellingPrice,
			});

			// 📌 Update product stock
			const updateStockQuery = `UPDATE product SET stock = stock - @quantity WHERE id = @productId`;
			await pool
				.request()
				.input("quantity", sql.Int, item.quantity)
				.input("productId", sql.Int, item.productId)
				.query(updateStockQuery);
		}

		const receipt = { items: receiptItems, totalAmount };

		res.status(201).json({ message: "Sale recorded successfully", receipt });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to process sale" });
	}
});

// 📌 Update a sale
router.put("/:id", async (req, res) => {
	try {
		const { quantity } = req.body;
		const sale = await Sales.findByPk(req.params.id);
		if (!sale) return res.status(404).json({ error: "Sale not found" });

		await sale.update({ quantity });
		res.json({ message: "Sale updated successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to update sale" });
	}
});

// 📌 Delete a sale
router.delete("/:id", async (req, res) => {
	try {
		const sale = await Sales.findByPk(req.params.id);
		if (!sale) return res.status(404).json({ error: "Sale not found" });

		await sale.destroy();
		res.json({ message: "Sale deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to delete sale" });
	}
});

module.exports = router;
