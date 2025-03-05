/** @format */

const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Adjust according to your DB setup

// Helper function for filtering
const getFilterCondition = (filter) => {
	switch (filter) {
		case "daily":
			return { createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } };
		case "weekly":
			return {
				createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
			};
		case "monthly":
			return { createdAt: { $gte: new Date(new Date().setDate(1)) } };
		case "yearly":
			return { createdAt: { $gte: new Date(new Date().setMonth(0, 1)) } };
		default:
			return {}; // No filter (All data)
	}
};

// Fetch Reports
const fetchReport = async (collection, filter, res) => {
	try {
		const query = getFilterCondition(filter);
		const data = await db.collection(collection).find(query).toArray();
		res.json(data);
	} catch (err) {
		console.error("Error fetching report:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Sales Report
router.get("/reports/sales", (req, res) => {
	fetchReport("sales", req.query.filter, res);
});

// Sales Returns Report
router.get("/reports/sales-returns", (req, res) => {
	fetchReport("salesReturns", req.query.filter, res);
});

// Purchases Report
router.get("/reports/purchases", (req, res) => {
	fetchReport("purchases", req.query.filter, res);
});

// Purchase Returns Report
router.get("/reports/purchase-returns", (req, res) => {
	fetchReport("purchaseReturns", req.query.filter, res);
});

// Suppliers Report
router.get("/reports/suppliers", async (req, res) => {
	try {
		const data = await db.collection("suppliers").find({}).toArray();
		res.json(data);
	} catch (err) {
		console.error("Error fetching suppliers:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Stock & Prices Report
router.get("/reports/stock-prices", async (req, res) => {
	try {
		const data = await db.collection("stockPrices").find({}).toArray();
		res.json(data);
	} catch (err) {
		console.error("Error fetching stock prices:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
