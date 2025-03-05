/** @format */

const sql = require("mssql");
require("dotenv").config();

const config = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_SERVER,
	database: process.env.DB_DATABASE,
	port: Number(process.env.DB_PORT),
	options: {
		encrypt: process.env.DB_ENCRYPT === "true", // Use encryption for Azure MSSQL
		trustServerCertificate: process.env.DB_TRUST_CERT === "true", // More control over SSL
	},
};

// ✅ Create a pool promise for better async handling
const poolPromise = new sql.ConnectionPool(config)
	.connect()
	.then((pool) => {
		console.log("✅ Connected to MSSQL Database");
		return pool;
	})
	.catch((err) => {
		console.error("❌ Database connection failed:", err);
		process.exit(1); // Exit on critical failure
	});

// ✅ Function to test the connection
const connectDB = async () => {
	try {
		const pool = await poolPromise;
		await pool.request().query("SELECT 1"); // Simple query to check connection
		console.log("✅ Database Connection Verified");
	} catch (err) {
		console.error("❌ Database Verification Failed:", err);
	}
};

module.exports = { connectDB, poolPromise, sql };

/** @format 

const sql = require("mssql");
require("dotenv").config();

const config = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_SERVER,
	database: process.env.DB_DATABASE,
	port: Number(process.env.DB_PORT),
	options: {
		encrypt: process.env.DB_ENCRYPT === "true", // Use encryption for Azure MSSQL
		trustServerCertificate: true, // Change based on security needs
	},
};

const pool = new sql.ConnectionPool(config);
const connectDB = async () => {
	try {
		await pool.connect();
		console.log("Connected to MSSQL Database");
	} catch (err) {
		console.error("Database connection failed", err);
	}
};

module.exports = { connectDB, pool };*/
