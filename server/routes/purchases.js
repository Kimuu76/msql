/** @format */

const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../config/db");
const Purchase = require("../models/purchases");

// ✅ Create a new purchase
router.post("/", async (req, res) => {
	try {
		const { productId, supplierId, quantity } = req.body;

		if (!productId || !supplierId || !quantity) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const purchase = await Purchase.createPurchase({
			productId,
			supplierId,
			quantity,
		});

		res.status(201).json({ message: "Purchase successful", purchase });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error processing purchase", error: error.message });
	}
});

// ✅ Get all purchases
router.get("/", async (req, res) => {
	try {
		const purchases = await Purchase.getAllPurchases();
		res.json(purchases);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching purchases", error: error.message });
	}
});

// ✅ Update an existing purchase
router.put("/:id", async (req, res) => {
	try {
		const pool = await poolPromise;
		const { id } = req.params;
		const { productId, supplierId, quantity, pricePerUnit } = req.body;

		const totalAmount = quantity * pricePerUnit;
		const updatedPurchase = await pool
			.query(
				"UPDATE purchase SET productId = @productId, supplierId = @supplierId, quantity = @quantity, totalAmount = @totalAmount OUTPUT INSERTED.* WHERE id = @id"
			)
			.input("productId", productId)
			.input("supplierId", supplierId)
			.input("quantity", quantity)
			.input("totalAmount", totalAmount)
			.input("id", id);

		if (updatedPurchase.rows.length === 0) {
			return res.status(404).json({ error: "Purchase not found" });
		}

		res.json({ purchase: updatedPurchase.rows[0] });
	} catch (error) {
		console.error("Error updating purchase:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// ✅ Delete a purchase
router.delete("/:id", async (req, res) => {
	try {
		const pool = await poolPromise;
		const { id } = req.params;
		const deletedPurchase = await pool
			.query("DELETE FROM purchases OUTPUT DELETED.* WHERE id = @id")
			.input("id", id);

		if (deletedPurchase.rows.length === 0) {
			return res.status(404).json({ error: "Purchase not found" });
		}

		res.json({ message: "Purchase deleted successfully" });
	} catch (error) {
		console.error("Error deleting purchase:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
