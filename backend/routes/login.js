/** @format */

const express = require("express");
const { poolPromise } = require("../config/db");

const router = express.Router();

// Login Route
router.post("/", async (req, res) => {
	const { secretKey } = req.body;

	if (!secretKey) {
		return res.status(400).json({ message: "Secret Key is required." });
	}

	try {
		// ✅ Get database connection from poolPromise
		const pool = await poolPromise;

		// Fetch the stored hashed secret key from the database
		const result = await pool.request().query("SELECT SecretKey FROM company");

		if (result.recordset.length === 0) {
			return res.status(404).json({ message: "No company setup found." });
		}

		const storedSecretKey = result.recordset[0].SecretKey;

		// Compare entered key with the stored secret key directly
		if (secretKey !== storedSecretKey) {
			return res.status(401).json({ message: "Invalid Secret Key!" });
		}

		res.json({ message: "Login successful!" });
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ message: "Server error. Please try again." });
	}
});

module.exports = router;
