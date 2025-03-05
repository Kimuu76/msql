/** @format */

const express = require("express");
const sql = require("mssql");
const router = express.Router();
const { pool } = require("../config/db");

// Get all stock prices
router.get("/", async (req, res) => {
	try {
		const pool = await sql.connect(dbConfig);
		const result = await pool.request().query(`
            SELECT p.id, p.name, s.stock, s.purchasePrice, s.sellingPrice
            FROM Products p
            LEFT JOIN StockPrices s ON p.id = s.productId
        `);
		res.json(result.recordset);
	} catch (error) {
		console.error("Error fetching stock prices:", error);
		res.status(500).json({ message: "Database error", error });
	}
});

// Get stock price for a specific product
router.get("/:productId", async (req, res) => {
	const { productId } = req.params;

	try {
		const pool = await sql.connect(dbConfig);
		const result = await pool
			.request()
			.input("productId", sql.Int, productId)
			.query("SELECT * FROM StockPrices WHERE productId = @productId");

		if (result.recordset.length === 0) {
			return res.status(404).json({ message: "Stock price not found" });
		}
		res.json(result.recordset[0]);
	} catch (error) {
		console.error("Error fetching stock price:", error);
		res.status(500).json({ message: "Database error", error });
	}
});

// Update or insert stock price for a product
router.put("/:productId", async (req, res) => {
	const { productId } = req.params;
	const { stock, purchasePrice, sellingPrice } = req.body;

	try {
		const pool = await sql.connect(dbConfig);
		const result = await pool
			.request()
			.input("productId", sql.Int, productId)
			.input("stock", sql.Int, stock)
			.input("purchasePrice", sql.Decimal(10, 2), purchasePrice)
			.input("sellingPrice", sql.Decimal(10, 2), sellingPrice).query(`
                MERGE INTO StockPrices AS target
                USING (SELECT @productId AS productId) AS source
                ON target.productId = source.productId
                WHEN MATCHED THEN
                    UPDATE SET stock = @stock, purchasePrice = @purchasePrice, sellingPrice = @sellingPrice
                WHEN NOT MATCHED THEN
                    INSERT (productId, stock, purchasePrice, sellingPrice)
                    VALUES (@productId, @stock, @purchasePrice, @sellingPrice);
            `);

		res.json({ message: "Stock price updated successfully" });
	} catch (error) {
		console.error("Error updating stock price:", error);
		res.status(500).json({ message: "Database error", error });
	}
});

module.exports = router;
