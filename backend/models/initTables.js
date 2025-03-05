/** @format */

const { poolPromise, sql } = require("../config/db");

const createTables = async () => {
	try {
		const pool = await poolPromise;

		await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'company')
            BEGIN
                CREATE TABLE Company (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    secretKey VARCHAR(255) NOT NULL
                );
            END;

            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'supplier')
            BEGIN
                CREATE TABLE Supplier (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    contact VARCHAR(255) NOT NULL,
                    address VARCHAR(255) NOT NULL
                );
            END;

            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'product')
            BEGIN
                CREATE TABLE Product (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    purchasePrice FLOAT,
                    sellingPrice FLOAT,
                    stock INT NOT NULL
                );
            END;

            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'purchase')
            BEGIN
                CREATE TABLE Purchase (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    productId INT NOT NULL,
                    supplierId INT NOT NULL,
                    quantity INT NOT NULL,
                    pricePerUnit FLOAT NOT NULL,
                    totalAmount FLOAT NOT NULL,
                    FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE,
                    FOREIGN KEY (supplierId) REFERENCES Supplier(id) ON DELETE CASCADE
                );
            END;

            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'sales')
            BEGIN
                CREATE TABLE Sales (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    productId INT NOT NULL,
                    productName VARCHAR(255) NOT NULL,
                    quantity INT NOT NULL,
                    sellingPricePerUnit FLOAT NOT NULL,
                    totalAmount FLOAT NOT NULL,
                    FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
                );
            END;

            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'purchaseReturns')
            BEGIN
                CREATE TABLE PurchaseReturns (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    purchaseId INT NOT NULL,
                    productId INT NOT NULL,
                    quantity INT NOT NULL,
                    reason VARCHAR(255) NOT NULL,
                    refundAmount FLOAT NOT NULL,
                    FOREIGN KEY (purchaseId) REFERENCES Purchase(id) ON DELETE CASCADE,
                    FOREIGN KEY (productId) REFERENCES Product(id) -- ❌ Removed ON DELETE CASCADE here
                );
            END;

            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'salesReturns')
            BEGIN
                CREATE TABLE SalesReturns (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    saleId INT NOT NULL,
                    productId INT NOT NULL,
                    quantity INT NOT NULL,
                    refundAmount FLOAT NOT NULL,
                    FOREIGN KEY (saleId) REFERENCES Sales(id) ON DELETE CASCADE,
                    FOREIGN KEY (productId) REFERENCES Product(id) -- ❌ Removed ON DELETE CASCADE here
                );
            END;
        `);

		console.log("✅ All Tables Created Successfully!");
	} catch (err) {
		console.error("❌ Error Creating Tables:", err);
	}
};

module.exports = createTables;
