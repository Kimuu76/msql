/** @format */

const sql = require("mssql");
//const dbConfig = require("../config/db"); // Ensure you have a database config file
const { poolPromise } = require("../config/db");

class Company {
	static async getAllCompanies() {
		try {
			const pool = await poolPromise;
			const result = await pool.request().query("SELECT * FROM company");
			//let pool = await sql.connect(dbConfig);
			//let result = await pool.request().query("SELECT * FROM company");
			return result.recordset;
		} catch (error) {
			console.error("Error fetching companies:", error);
			throw error;
		}
	}

	static async getCompanyById(id) {
		try {
			const pool = await poolPromise;
			const result = await pool
				.request()
				.input("id", sql.Int, id)
				.query("SELECT * FROM company WHERE id = @id");
			return result.recordset[0];
		} catch (error) {
			console.error("Error fetching company:", error);
			throw error;
		}
	}

	static async createCompany(name, secretKey) {
		try {
			const pool = await poolPromise;
			await pool
				.request()
				.input("name", sql.VarChar, name)
				.input("secretKey", sql.VarChar, secretKey)
				.query(
					"INSERT INTO company (name, secretKey) VALUES (@name, @secretKey)"
				);
			return { message: "Company created successfully" };
		} catch (error) {
			console.error("Error creating company:", error);
			throw error;
		}
	}

	static async updateCompany(id, name, secretKey) {
		try {
			const pool = await poolPromise;
			await pool
				.request()
				.input("id", sql.Int, id)
				.input("name", sql.VarChar, name)
				.input("secretKey", sql.VarChar, secretKey)
				.query(
					"UPDATE company SET name = @name, secretKey = @secretKey WHERE id = @id"
				);
			return { message: "Company updated successfully" };
		} catch (error) {
			console.error("Error updating company:", error);
			throw error;
		}
	}

	static async deleteCompany(id) {
		try {
			const pool = await poolPromise;
			await pool
				.request()
				.input("id", sql.Int, id)
				.query("DELETE FROM company WHERE id = @id");
			return { message: "Company deleted successfully" };
		} catch (error) {
			console.error("Error deleting company:", error);
			throw error;
		}
	}
}

module.exports = Company;
