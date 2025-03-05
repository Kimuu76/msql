/** @format */

const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../config/db");

// GET all suppliers
router.get("/", async (req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.query("SELECT * FROM supplier");
		res.json(result.recordset);
	} catch (err) {
		res.status(500).json({ error: "Database error", details: err.message });
	}
});

// GET a single supplier by ID
router.get("/:id", async (req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input("id", sql.Int, req.params.id)
			.query("SELECT * FROM supplier WHERE id = @id");

		if (result.recordset.length === 0) {
			return res.status(404).json({ message: "Supplier not found" });
		}

		res.json(result.recordset[0]);
	} catch (err) {
		res.status(500).json({ error: "Database error", details: err.message });
	}
});

// ADD a new supplier
router.post("/", async (req, res) => {
	const { name, contact, address } = req.body;

	if (!name || !contact || !address) {
		return res.status(400).json({ message: "All fields are required" });
	}

	try {
		const pool = await poolPromise;
		await pool
			.request()
			.input("name", sql.NVarChar, name)
			.input("contact", sql.NVarChar, contact)
			.input("address", sql.NVarChar, address)
			.query(
				"INSERT INTO supplier (name, contact, address) VALUES (@name, @contact, @address)"
			);

		res.status(201).json({ message: "Supplier added successfully" });
	} catch (err) {
		res.status(500).json({ error: "Database error", details: err.message });
	}
});

// UPDATE an existing supplier
router.put("/:id", async (req, res) => {
	const { name, contact, address } = req.body;
	const { id } = req.params;

	try {
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input("id", sql.Int, id)
			.input("name", sql.NVarChar, name)
			.input("contact", sql.NVarChar, contact)
			.input("address", sql.NVarChar, address)
			.query(
				"UPDATE supplier SET name=@name, contact=@contact, address=@address WHERE id=@id"
			);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: "Supplier not found" });
		}

		res.json({ message: "Supplier updated successfully" });
	} catch (err) {
		res.status(500).json({ error: "Database error", details: err.message });
	}
});

// DELETE a supplier
router.delete("/:id", async (req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input("id", sql.Int, req.params.id)
			.query("DELETE FROM supplier WHERE id = @id");

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: "Supplier not found" });
		}

		res.json({ message: "Supplier deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: "Database error", details: err.message });
	}
});

module.exports = router;
