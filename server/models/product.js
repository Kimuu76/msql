/** @format */

const sql = require("mssql");
const { poolPromise } = require("../config/db"); // Ensure this connects to your MSSQL DB

const Product = {
	async insert(product) {
		try {
			const pool = await poolPromise;
			const query = `
			INSERT INTO product (name, purchasePrice, sellingPrice, stock)
			OUTPUT INSERTED.*
			VALUES (@name, @purchasePrice, @sellingPrice, @stock)
		`;
			const result = await pool
				.request()
				.input("name", sql.NVarChar, product.name)
				.input("purchasePrice", sql.Float, product.purchasePrice)
				.input("sellingPrice", sql.Float, product.sellingPrice)
				.input("stock", sql.Int, product.stock)
				.query(query);
			return result.recordset[0];
		} catch (error) {
			console.error("❌ Error inserting product:", error);
			throw error;
		}
	},

	async findAll() {
		try {
			const pool = await poolPromise;
			const query = `SELECT * FROM product`;
			const result = await pool.request().query(query);
			return result.recordset;
		} catch (error) {
			console.error("❌ Error fetching products:", error);
			throw error;
		}
	},

	async findById(id) {
		try {
			const pool = await poolPromise;
			const query = `SELECT * FROM product WHERE id = @id`;
			const result = await pool.request().input("id", sql.Int, id).query(query);
			return result.recordset[0] || null;
		} catch (error) {
			console.error("❌ Error finding product by ID:", error);
			throw error;
		}
	},

	async update(id, product) {
		const pool = await poolPromise;
		const query = `
			UPDATE product
			SET name = @name, purchasePrice = @purchasePrice, sellingPrice = @sellingPrice, stock = @stock
			OUTPUT INSERTED.*
			WHERE id = @id
		`;
		const result = await pool
			.request()
			.input("id", sql.Int, id)
			.input("name", sql.NVarChar, product.name)
			.input("purchasePrice", sql.Float, product.purchasePrice)
			.input("sellingPrice", sql.Float, product.sellingPrice)
			.input("stock", sql.Int, product.stock)
			.query(query);
		return result.recordset[0] || null;
	},

	async delete(id) {
		const pool = await poolPromise;
		const query = `DELETE FROM product WHERE id = @id`;
		await pool.request().input("id", sql.Int, id).query(query);
		return true;
	},
};

module.exports = Product;
