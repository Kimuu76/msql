/** @format */

const sql = require("mssql");
const config = require("../config/db"); // Ensure you have an MSSQL config file

const Product = require("./product");
const Purchase = require("./purchases");
const Sales = require("./sales");
const SalesReturns = require("./salesReturns");
const PurchaseReturns = require("./PurchaseReturns");
const Supplier = require("./supplier");
const Company = require("./company");

// Function to ensure tables exist & relationships are managed
async function setupDatabase() {
	try {
		let pool = await sql.connect(config);

		// Example: Creating Sales table with a foreign key to Product
		await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Sales')
            CREATE TABLE Sales (
                id INT IDENTITY(1,1) PRIMARY KEY,
                productId INT FOREIGN KEY REFERENCES Product(id) ON DELETE CASCADE,
                quantity INT NOT NULL,
                totalAmount DECIMAL(18,2) NOT NULL
            );
        `);

		console.log("✅ Database setup complete");
	} catch (err) {
		console.error("❌ Error setting up database:", err);
	}
}

module.exports = {
	Sales,
	Product,
	Purchase,
	Supplier,
	SalesReturns,
	PurchaseReturns,
	Company,
	setupDatabase,
};
