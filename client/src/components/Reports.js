/** @format*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Container,
	Typography,
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	Select,
	MenuItem,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Reports = () => {
	const [sales, setSales] = useState([]);
	const [salesReturns, setSalesReturns] = useState([]);
	const [purchases, setPurchases] = useState([]);
	const [purchaseReturns, setPurchaseReturns] = useState([]);
	const [suppliers, setSuppliers] = useState([]);
	const [stockPrices, setStockPrices] = useState([]);
	const [filter, setFilter] = useState("all"); // ✅ Filter (Daily, Weekly, Monthly, Yearly)

	useEffect(() => {
		fetchReports();
	}, [filter]); // Re-fetch when filter changes

	const fetchReports = async () => {
		try {
			const [
				salesRes,
				salesReturnsRes,
				purchasesRes,
				purchaseReturnsRes,
				suppliersRes,
				stockPricesRes,
			] = await Promise.all([
				axios.get("http://localhost:5000/reports/sales?filter=${filter"),
				axios.get(
					"http://localhost:5000/reports/sales-returns?filter=${filter"
				),
				axios.get("http://localhost:5000/reports/purchases?filter=${filter"),
				axios.get(
					"http://localhost:5000/reports/purchase-returns?filter=${filter"
				),
				axios.get("http://localhost:5000/reports/suppliers"),
				axios.get("http://localhost:5000/reports/stock-prices"),
			]);

			console.log("Sales Data:", salesRes.data); // ✅ Debugging
			console.log("Purchases Data:", purchasesRes.data); // ✅ Debugging

			setSales(salesRes.data || []);
			setSalesReturns(salesReturnsRes.data || []);
			setPurchases(purchasesRes.data || []);
			setPurchaseReturns(purchaseReturnsRes.data || []);
			setSuppliers(suppliersRes.data || []);
			setStockPrices(stockPricesRes.data || []);
		} catch (error) {
			console.error("❌ Error fetching reports:", error);
		}
	};

	// ✅ Generate & Download PDF
	const generatePDF = (title, data, columns) => {
		const doc = new jsPDF();
		doc.text(title, 14, 15);
		doc.autoTable({
			startY: 20,
			head: [columns],
			body: data.map((item) => columns.map((col) => item[col] || "-")),
		});
		doc.save(`${title}.pdf`);
	};

	return (
		<Container>
			<Typography variant='h4' align='center' gutterBottom>
				📊 Reports Management
			</Typography>

			{/* Filters */}
			<Box display='flex' justifyContent='center' mb={3}>
				<Select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					displayEmpty
					sx={{ width: "200px" }}
				>
					<MenuItem value='all'>📋 All</MenuItem>
					<MenuItem value='daily'>📅 Daily</MenuItem>
					<MenuItem value='weekly'>🗓 Weekly</MenuItem>
					<MenuItem value='monthly'>📆 Monthly</MenuItem>
					<MenuItem value='yearly'>📊 Yearly</MenuItem>
				</Select>
			</Box>

			{/* Reports Section */}
			{[
				{
					title: "Sales Report",
					data: sales,
					columns: ["productName", "quantity", "totalAmount"],
				},
				{
					title: "Sales Returns Report",
					data: salesReturns,
					columns: ["productName", "quantity", "refundAmount"],
				},
				{
					title: "Purchases Report",
					data: purchases,
					columns: ["productName", "supplier", "quantity", "totalAmount"],
				},
				{
					title: "Purchase Returns Report",
					data: purchaseReturns,
					columns: ["productName", "quantity", "reason"],
				},
				{
					title: "Suppliers Report",
					data: suppliers,
					columns: ["name", "contact", "address"],
				},
				{
					title: "Stock & Prices Report",
					data: stockPrices,
					columns: ["productName", "stock", "purchasePrice", "sellingPrice"],
				},
			].map((report, index) => (
				<Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }} key={index}>
					<Typography variant='h6'>{report.title}</Typography>
					<Table>
						<TableHead>
							<TableRow>
								{report.columns.map((col, i) => (
									<TableCell key={i}>
										{col.replace(/([A-Z])/g, " $1").trim()}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{report.data.length > 0 ? (
								report.data.map((row, i) => (
									<TableRow key={i}>
										{report.columns.map((col, j) => (
											<TableCell key={j}>{row[col] || "-"}</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={report.columns.length} align='center'>
										No data available
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
					<Button
						variant='contained'
						color='primary'
						onClick={() =>
							generatePDF(report.title, report.data, report.columns)
						}
						sx={{ marginTop: 2 }}
					>
						📄 Download {report.title}
					</Button>
				</Paper>
			))}
		</Container>
	);
};

export default Reports;
