/** @format */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/db");
const path = require("path");
const setupRoutes = require("./routes/setup");
const app = express();
const loginRoutes = require("./routes/login");
const dashboardRoutes = require("./routes/dashboard");
const purchaseReturnsRoutes = require("./routes/purchaseReturns");
const productsRoutes = require("./routes/products");
const purchasesRoutes = require("./routes/purchases");
const reportsRoutes = require("./routes/reports");
const salesRoutes = require("./routes/sales");
const salesReturnsRoutes = require("./routes/salesReturns");
const stockPricesRoutes = require("./routes/stockPrices");
const suppliersRoutes = require("./routes/suppliers");
const companyRoutes = require("./routes/company");
const createTables = require("./models/initTables");

const PORT = process.env.PORT || 5000;

app.use(
	cors({
		origin: "https://msql.onrender.com",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true, // Allow cookies
		allowedHeaders: ["Content-Type", "Authorization"], // Make sure Authorization is allowed
	})
);

app.use(bodyParser.json());

//  Routes
app.use("/setup", setupRoutes);
app.use("/login", loginRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/purchase-returns", purchaseReturnsRoutes);
app.use("/products", productsRoutes);
app.use("/sales", salesRoutes);
app.use("/sales-returns", salesReturnsRoutes);
app.use("/stockPrices", stockPricesRoutes);
app.use("/supplier", suppliersRoutes);
app.use("/reports", reportsRoutes);
app.use("/purchases", purchasesRoutes);
app.use("/company", companyRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
	});
}

app.listen(PORT, async () => {
	await createTables();
	await connectDB();
	console.log(`Server running on port ${PORT}`);
});
