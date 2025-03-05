/** @format */

const sql = require("mssql");
const { poolPromise } = require("../config/db");

const Sales = {
	async insert(sale) {
		const pool = await poolPromise;
		const query = `
			INSERT INTO sales (productId, productName, quantity, sellingPricePerUnit, totalAmount)
			OUTPUT INSERTED.*
			VALUES (@productId, @productName, @quantity, @sellingPricePerUnit, @totalAmount)
		`;
		const result = await pool
			.request()
			.input("productId", sql.Int, sale.productId)
			.input("productName", sql.NVarChar, sale.productName)
			.input("quantity", sql.Int, sale.quantity)
			.input("sellingPricePerUnit", sql.Float, sale.sellingPricePerUnit)
			.input("totalAmount", sql.Float, sale.totalAmount)
			.query(query);
		return result.recordset[0];
	},

	async findAll() {
		const pool = await poolPromise;
		const query = `
		SELECT s.id, s.productId, p.name AS productName, s.quantity, s.sellingPricePerUnit, s.totalAmount
		FROM sales s
		LEFT JOIN product p ON s.productId = p.id
	`;
		const result = await pool.request().query(query);
		return result.recordset;
	},

	async findById(id) {
		const pool = await poolPromise;
		const query = `SELECT * FROM sales WHERE id = @id`;
		const result = await pool.request().input("id", sql.Int, id).query(query);
		return result.recordset[0] || null;
	},

	async update(id, sale) {
		const pool = await poolPromise;
		const query = `
			UPDATE sales
			SET productId = @productId, productName = @productName, quantity = @quantity,
				sellingPricePerUnit = @sellingPricePerUnit, totalAmount = @totalAmount
			OUTPUT INSERTED.*
			WHERE id = @id
		`;
		const result = await pool
			.request()
			.input("id", sql.Int, id)
			.input("productId", sql.Int, sale.productId)
			.input("productName", sql.NVarChar, sale.productName)
			.input("quantity", sql.Int, sale.quantity)
			.input("sellingPricePerUnit", sql.Float, sale.sellingPricePerUnit)
			.input("totalAmount", sql.Float, sale.totalAmount)
			.query(query);
		return result.recordset[0] || null;
	},

	async delete(id) {
		const pool = await poolPromise;
		const query = `DELETE FROM sales WHERE id = @id`;
		await pool.request().input("id", sql.Int, id).query(query);
		return true;
	},
};

module.exports = Sales;
