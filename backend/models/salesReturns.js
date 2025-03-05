/** @format */

const sql = require("mssql");
const db = require("../config/db");

const SalesReturns = {
	async createTable() {
		const query = `
			IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SalesReturns' AND xtype='U')
			CREATE TABLE SalesReturns (
				id INT IDENTITY(1,1) PRIMARY KEY,
				saleId INT NOT NULL,
				productId INT NOT NULL,
				quantity INT NOT NULL,
				refundAmount FLOAT NOT NULL,
				FOREIGN KEY (saleId) REFERENCES Sales(id) ON DELETE CASCADE,
				FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
			);
		`;
		await db.request().query(query);
	},

	async insert(salesReturn) {
		const query = `
			INSERT INTO SalesReturns (saleId, productId, quantity, refundAmount)
			OUTPUT INSERTED.*
			VALUES (@saleId, @productId, @quantity, @refundAmount)
		`;
		const result = await db
			.request()
			.input("saleId", sql.Int, salesReturn.saleId)
			.input("productId", sql.Int, salesReturn.productId)
			.input("quantity", sql.Int, salesReturn.quantity)
			.input("refundAmount", sql.Float, salesReturn.refundAmount)
			.query(query);
		return result.recordset[0];
	},

	async findAll() {
		const query = `SELECT * FROM SalesReturns`;
		const result = await db.request().query(query);
		return result.recordset;
	},

	async findById(id) {
		const query = `SELECT * FROM SalesReturns WHERE id = @id`;
		const result = await db.request().input("id", sql.Int, id).query(query);
		return result.recordset[0] || null;
	},

	async update(id, salesReturn) {
		const query = `
			UPDATE SalesReturns
			SET saleId = @saleId, productId = @productId, quantity = @quantity, refundAmount = @refundAmount
			OUTPUT INSERTED.*
			WHERE id = @id
		`;
		const result = await db
			.request()
			.input("id", sql.Int, id)
			.input("saleId", sql.Int, salesReturn.saleId)
			.input("productId", sql.Int, salesReturn.productId)
			.input("quantity", sql.Int, salesReturn.quantity)
			.input("refundAmount", sql.Float, salesReturn.refundAmount)
			.query(query);
		return result.recordset[0] || null;
	},

	async delete(id) {
		const query = `DELETE FROM SalesReturns WHERE id = @id`;
		await db.request().input("id", sql.Int, id).query(query);
		return true;
	},
};

module.exports = SalesReturns;
