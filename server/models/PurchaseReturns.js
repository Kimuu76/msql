/** @format */

const { poolPromise, sql } = require("../config/db");

const PurchaseReturns = {
	async insert(purchaseReturn) {
		const pool = await poolPromise;
		const query = `
			INSERT INTO purchaseReturns (purchaseId, productId, quantity, reason, refundAmount)
			OUTPUT INSERTED.*
			VALUES (@purchaseId, @productId, @quantity, @reason, @refundAmount)
		`;
		const result = await pool
			.request()
			.input("purchaseId", sql.Int, purchaseReturn.purchaseId)
			.input("productId", sql.Int, purchaseReturn.productId)
			.input("quantity", sql.Int, purchaseReturn.quantity)
			.input("reason", sql.NVarChar, purchaseReturn.reason)
			.input("refundAmount", sql.Float, purchaseReturn.refundAmount)
			.query(query);
		return result.recordset[0];
	},

	async findAll() {
		const pool = await poolPromise;
		const query = `SELECT * FROM purchaseReturns`;
		const result = await pool.request().query(query);
		return result.recordset;
	},

	async findById(id) {
		const pool = await poolPromise;
		const query = `SELECT * FROM purchaseReturns WHERE id = @id`;
		const result = await pool.request().input("id", sql.Int, id).query(query);
		return result.recordset[0] || null;
	},

	async update(id, purchaseReturn) {
		const pool = await poolPromise;
		const query = `
			UPDATE purchaseReturns
			SET purchaseId = @purchaseId, productId = @productId, quantity = @quantity,
				reason = @reason, refundAmount = @refundAmount
			OUTPUT INSERTED.*
			WHERE id = @id
		`;
		const result = await pool
			.request()
			.input("id", sql.Int, id)
			.input("purchaseId", sql.Int, purchaseReturn.purchaseId)
			.input("productId", sql.Int, purchaseReturn.productId)
			.input("quantity", sql.Int, purchaseReturn.quantity)
			.input("reason", sql.NVarChar, purchaseReturn.reason)
			.input("refundAmount", sql.Float, purchaseReturn.refundAmount)
			.query(query);
		return result.recordset[0] || null;
	},

	async delete(id) {
		const pool = await poolPromise;
		const query = `DELETE FROM purchaseReturns WHERE id = @id`;
		await pool.request().input("id", sql.Int, id).query(query);
		return true;
	},
};

module.exports = PurchaseReturns;
