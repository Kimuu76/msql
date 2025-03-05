/** @format */

const express = require("express");
const { poolPromise, sql } = require("../config/db");

const router = express.Router();

// Setup Company Route
router.post("/", async (req, res) => {
	const { name, secretKey } = req.body;

	if (!name || !secretKey) {
		return res
			.status(400)
			.json({ message: "Company Name and Secret Key are required." });
	}

	try {
		// ✅ Get database connection from poolPromise
		const pool = await poolPromise;

		// Insert into database
		await pool
			.request()
			.input("name", sql.VarChar, name)
			.input("secretKey", sql.VarChar, secretKey)
			.query(
				"INSERT INTO company (name, SecretKey) VALUES (@name, @secretKey)"
			);

		res.json({ message: "Company set up successfully!" });
	} catch (err) {
		console.error("Setup error:", err);
		res
			.status(500)
			.json({ message: "Server error. Could not set up company." });
	}
});

module.exports = router;
