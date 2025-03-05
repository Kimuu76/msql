/** @format */

const express = require("express");
const router = express.Router();
const Company = require("../models/company");

// GET company name
router.get("/", async (req, res) => {
	try {
		const company = await Company.getAllCompanies(); // Fetch the first company record
		if (!company) {
			return res.status(404).json({ message: "Company not found" });
		}
		res.json({ name: company.name });
	} catch (error) {
		console.error("Error fetching company setup:", error);
		res.status(500).json({ message: "Server error", error });
	}
});

// ✅ ADD THIS: POST route to create a company
router.post("/", async (req, res) => {
	try {
		const { name, secretKey } = req.body;
		if (!name || !secretKey) {
			return res
				.status(400)
				.json({ message: "Name and secretKey are required" });
		}

		// Create new company
		const newCompany = new Company.createCompany({ name, secretKey });
		await newCompany.save();

		res
			.status(201)
			.json({ message: "Company created successfully", company: newCompany });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
});

module.exports = router;
