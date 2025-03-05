/** @format */

const express = require("express");
const router = express.Router();
const { poolPromise } = require("../config/db");

// 📌 Get all purchase returns
router.get("/", async (req, res) => {
	try {
		const pool = await poolPromise;
		const results = await pool.request().query("SELECT * FROM purchaseReturns");
		res.json(results.rows);
	} catch (error) {
		console.error("Error fetching purchase returns:", error);
		res.status(500).json({ error: "Server error while fetching data" });
	}
});

// 📌 Add a new purchase return
router.post("/", async (req, res) => {
	const pool = await poolPromise;
	const { purchaseId, productId, quantity, refundAmount, reason } = req.body;

	if (!purchaseId || !productId || !quantity || !refundAmount || !reason) {
		return res.status(400).json({ error: "All fields are required" });
	}

	try {
		const result = await pool
			.request()
			.input("purchaseId", purchaseId)
			.input("productId", productId)
			.input("quantity", quantity)
			.input("refundAmount", refundAmount)
			.input("reason", reason)
			.query(
				`INSERT INTO purchaseReturns (purchase_id, product_id, quantity, refund_amount, reason)
         OUTPUT INSERTED.* 
         VALUES (@purchaseId, @productId, @quantity, @refundAmount, @reason)`
			);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error processing purchase return:", error);
		res.status(500).json({ error: "Failed to process return" });
	}
});

// 📌 Update a purchase return
router.put("/:id", async (req, res) => {
	const pool = await poolPromise;
	const { id } = req.params;
	const { quantity, refundAmount, reason } = req.body;

	try {
		const result = await pool
			.request()
			.input("id", id)
			.input("quantity", quantity)
			.input("refundAmount", refundAmount)
			.input("reason", reason)
			.query(
				`UPDATE purchaseReturns
         SET quantity = @quantity, refund_amount = @refundAmount, reason = @reason
         OUTPUT INSERTED.*
         WHERE id = @id`
			);

		if (result.rowCount === 0) {
			return res.status(404).json({ error: "Return not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating purchase return:", error);
		res.status(500).json({ error: "Failed to update return" });
	}
});

// 📌 Delete a purchase return
router.delete("/:id", async (req, res) => {
	const pool = await poolPromise;
	const { id } = req.params;

	try {
		const result = await pool
			.request()
			.input("id", id)
			.query("DELETE FROM purchaseReturns WHERE id = @id");

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ error: "Return not found" });
		}

		res.json({ message: "Purchase return deleted successfully" });
	} catch (error) {
		console.error("Error deleting purchase return:", error);
		res.status(500).json({ error: "Failed to delete return" });
	}
});

module.exports = router;
