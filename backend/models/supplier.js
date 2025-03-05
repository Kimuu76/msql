/** @format */

const { poolPromise, sql } = require("../config/db");

const Supplier = {
	async insert(supplier) {
		const pool = await poolPromise;
		const query = `
			INSERT INTO supplier (name, contact, address)
			OUTPUT INSERTED.*
			VALUES (@name, @contact, @address)
		`;
		await pool
			.request()
			.request()
			.input("name", sql.NVarChar, supplier.name)
			.input("contact", sql.NVarChar, supplier.contact)
			.input("address", sql.NVarChar, supplier.address)
			.query(query);
		return result.recordset[0];
	},

	async findAll() {
		const pool = await poolPromise;
		const query = `SELECT * FROM supplier`;
		const result = await pool.request().query(query);
		return result.recordset;
	},

	async findById(id) {
		const pool = await poolPromise;
		const query = `SELECT * FROM supplier WHERE id = @id`;
		const result = await pool.request().input("id", sql.Int, id).query(query);
		return result.recordset[0] || null;
	},

	async update(id, supplier) {
		const pool = await poolPromise;
		const query = `
			UPDATE supplier
			SET name = @name, contact = @contact, address = @address
			OUTPUT INSERTED.*
			WHERE id = @id
		`;
		const result = await pool
			.request()
			.input("id", sql.Int, id)
			.input("name", sql.NVarChar, supplier.name)
			.input("contact", sql.NVarChar, supplier.contact)
			.input("address", sql.NVarChar, supplier.address)
			.query(query);
		return result.recordset[0] || null;
	},

	async delete(id) {
		const pool = await poolPromise;
		const query = `DELETE FROM supplier WHERE id = @id`;
		await pool.request().input("id", sql.Int, id).query(query);
		return true;
	},
};

module.exports = Supplier;
