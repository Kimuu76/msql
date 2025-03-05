/** @format */

const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET Dashboard Data
router.get("/", async (req, res) => {
	try {
		const salesQuery = "SELECT SUM(amount) AS totalSales FROM sales";
		const purchasesQuery =
			"SELECT SUM(amount) AS totalPurchases FROM purchases";
		const salesReturnsQuery =
			"SELECT SUM(amount) AS salesReturns FROM sales_returns";
		const purchasesReturnsQuery =
			"SELECT SUM(amount) AS purchasesReturns FROM purchases_returns";
		const salesByDateQuery =
			"SELECT DATE(sale_date) AS date, SUM(amount) AS sales FROM sales GROUP BY DATE(sale_date)";
		const purchasesByDateQuery =
			"SELECT DATE(purchase_date) AS date, SUM(amount) AS purchases FROM purchases GROUP BY DATE(purchase_date)";

		const [sales] = await db.query(salesQuery);
		const [purchases] = await db.query(purchasesQuery);
		const [salesReturns] = await db.query(salesReturnsQuery);
		const [purchasesReturns] = await db.query(purchasesReturnsQuery);
		const [salesByDate] = await db.query(salesByDateQuery);
		const [purchasesByDate] = await db.query(purchasesByDateQuery);

		res.json({
			totalSales: sales[0].totalSales || 0,
			totalPurchases: purchases[0].totalPurchases || 0,
			salesReturns: salesReturns[0].salesReturns || 0,
			purchasesReturns: purchasesReturns[0].purchasesReturns || 0,
			salesByDate,
			purchasesByDate,
		});
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
