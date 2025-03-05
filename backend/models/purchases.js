/** @format */

const { poolPromise, sql } = require("../config/db");

const Purchase = {
	async createPurchase({ productId, supplierId, quantity }) {
		try {
			const pool = await poolPromise;

			// 1️⃣ Fetch purchasePrice from Product table
			const productResult = await pool
				.request()
				.input("productId", sql.Int, productId)
				.query("SELECT pricePerUnit, stock FROM Product WHERE id = @productId");

			if (productResult.recordset.length === 0) {
				throw new Error("Product not found");
			}

			const { pricePerUnit, stock } = productResult.recordset[0];

			// 2️⃣ Compute total cost
			const totalAmount = pricePerUnit * quantity;

			// 3️⃣ Insert purchase into Purchases table
			const purchaseResult = await pool
				.request()
				.input("productId", sql.Int, productId)
				.input("supplierId", sql.Int, supplierId)
				.input("quantity", sql.Int, quantity)
				.input("pricePerUnit", sql.Decimal(10, 2), pricePerUnit)
				.input("totalAmount", sql.Decimal(10, 2), totalAmount).query(`
                    INSERT INTO purchase (productId, supplierId, quantity, pricePerUnit, totalCost)
                    OUTPUT INSERTED.*
                    VALUES (@productId, @supplierId, @quantity, @pricePerUnit, @totalAmount)
                `);

			// 4️⃣ Update stock in Product table
			await pool
				.request()
				.input("productId", sql.Int, productId)
				.input("newStock", sql.Int, stock + quantity) // 🔺 Increase stock
				.query("UPDATE product SET stock = @newStock WHERE id = @productId");

			return purchaseResult.recordset[0];
		} catch (error) {
			console.error("❌ Error processing purchase:", error);
			throw error;
		}
	},

	async getAllPurchases() {
		try {
			const pool = await poolPromise;
			const query = `
                SELECT p.id, pr.name AS productName, s.name AS supplierName, 
                    p.quantity, p.purchasePrice, p.totalCost, p.createdAt
                FROM purchase p
                JOIN Product pr ON p.productId = pr.id
                JOIN Supplier s ON p.supplierId = s.id
                ORDER BY p.createdAt DESC
            `;
			const result = await pool.request().query(query);
			return result.recordset;
		} catch (error) {
			console.error("❌ Error fetching purchases:", error);
			throw error;
		}
	},

	async findById(id) {
		const pool = await poolPromise;
		const query = `SELECT * FROM purchase WHERE id = @id`;
		const result = await pool.request().input("id", sql.Int, id).query(query);
		return result.recordset[0] || null;
	},

	async update(id, purchase) {
		const pool = await poolPromise;
		const query = `
			UPDATE purchase
			SET productId = @productId, supplierId = @supplierId, quantity = @quantity,
				pricePerUnit = @pricePerUnit, totalAmount = @totalAmount
			OUTPUT INSERTED.*
			WHERE id = @id
		`;
		const result = await pool
			.request()
			.input("id", sql.Int, id)
			.input("productId", sql.Int, purchase.productId)
			.input("supplierId", sql.Int, purchase.supplierId)
			.input("quantity", sql.Int, purchase.quantity)
			.input("pricePerUnit", sql.Float, purchase.pricePerUnit)
			.input("totalAmount", sql.Float, purchase.totalAmount)
			.query(query);
		return result.recordset[0] || null;
	},

	async delete(id) {
		const pool = await poolPromise;
		const query = `DELETE FROM purchase WHERE id = @id`;
		await pool.request().input("id", sql.Int, id).query(query);
		return true;
	},
};

module.exports = Purchase;
