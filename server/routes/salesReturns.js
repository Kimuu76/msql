/** @format */

const express = require("express");
const router = express.Router();

let salesReturns = [];

// Fetch all sales
router.get("/sales", (req, res) => {
	res.json(sales);
});

// Fetch all sales returns
router.get("/sales-returns", (req, res) => {
	res.json(salesReturns);
});

// Process a sales return
router.post("/sales-returns", (req, res) => {
	const { saleId, returnQuantity, reason } = req.body;
	const sale = sales.find((s) => s.id === parseInt(saleId));

	if (!sale) {
		return res.status(404).json({ message: "Sale not found" });
	}

	if (returnQuantity > sale.quantity) {
		return res
			.status(400)
			.json({ message: "Return quantity exceeds sold quantity" });
	}

	const newReturn = {
		id: salesReturns.length + 1,
		productName: sale.productName,
		quantity: returnQuantity,
		refundAmount: returnQuantity * 10, // Mock refund calculation
		reason,
	};

	salesReturns.push(newReturn);
	res
		.status(201)
		.json({ message: "Sales return processed", salesReturn: newReturn });
});

// Update a sales return
router.put("/sales-returns/:id", (req, res) => {
	const { id } = req.params;
	const { quantity, refundAmount } = req.body;

	const returnIndex = salesReturns.findIndex((sr) => sr.id === parseInt(id));
	if (returnIndex === -1) {
		return res.status(404).json({ message: "Sales return not found" });
	}

	salesReturns[returnIndex].quantity = quantity;
	salesReturns[returnIndex].refundAmount = refundAmount;

	res.json({
		message: "Sales return updated",
		salesReturn: salesReturns[returnIndex],
	});
});

// Delete a sales return
router.delete("/sales-returns/:id", (req, res) => {
	const { id } = req.params;
	salesReturns = salesReturns.filter((sr) => sr.id !== parseInt(id));
	res.json({ message: "Sales return deleted" });
});

module.exports = router;
