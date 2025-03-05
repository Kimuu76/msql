/** @format */

import { useEffect, useState } from "react";
import axios from "axios";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	Box,
	Paper,
	Container,
	CircularProgress,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
	const [dashboardData, setDashboardData] = useState({
		totalSales: 0,
		totalPurchases: 0,
		salesReturns: 0,
		purchasesReturns: 0,
		salesByDate: [],
		purchasesByDate: [],
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		try {
			const response = await axios.get("http://localhost:5000/dashboard");
			setDashboardData(response.data);
		} catch (error) {
			console.error("❌ Error fetching dashboard data:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth='lg' sx={{ mt: 3 }}>
			<Typography variant='h4' fontWeight='bold' align='center' gutterBottom>
				📊 Dashboard Overview
			</Typography>

			{loading ? (
				<Box display='flex' justifyContent='center' mt={5}>
					<CircularProgress />
				</Box>
			) : (
				<>
					{/* Summary Cards */}
					<Grid container spacing={3}>
						{[
							{
								title: "Total Sales",
								value: `KES ${dashboardData.totalSales}`,
								color: "#4CAF50",
							},
							{
								title: "Total Purchases",
								value: `KES ${dashboardData.totalPurchases}`,
								color: "#2196F3",
							},
							{
								title: "Sales Returns",
								value: `KES ${dashboardData.salesReturns}`,
								color: "#FF9800",
							},
							{
								title: "Purchase Returns",
								value: `KES ${dashboardData.purchasesReturns}`,
								color: "#F44336",
							},
						].map((item, index) => (
							<Grid item xs={12} sm={6} md={3} key={index}>
								<Card
									sx={{
										backgroundColor: item.color,
										color: "#fff",
										textAlign: "center",
										borderRadius: 2,
										boxShadow: 3,
										"&:hover": { boxShadow: 6 },
									}}
								>
									<CardContent>
										<Typography variant='h6'>{item.title}</Typography>
										<Typography variant='h4' fontWeight='bold'>
											{item.value}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>

					{/* Sales & Purchases Chart */}
					<Paper
						elevation={3}
						sx={{
							padding: 3,
							marginTop: 4,
							borderRadius: 2,
							boxShadow: 3,
							backgroundColor: "#fff",
						}}
					>
						<Typography variant='h6' fontWeight='bold' gutterBottom>
							📅 Sales & Purchases Overview (This Week)
						</Typography>
						<Bar
							data={{
								labels: dashboardData.salesByDate.map((data) => data.date),
								datasets: [
									{
										label: "Sales",
										data: dashboardData.salesByDate.map((data) => data.sales),
										backgroundColor: "rgba(75, 192, 192, 0.7)",
										borderRadius: 4,
									},
									{
										label: "Purchases",
										data: dashboardData.purchasesByDate.map(
											(data) => data.purchases
										),
										backgroundColor: "rgba(153, 102, 255, 0.7)",
										borderRadius: 4,
									},
								],
							}}
							options={{
								plugins: {
									legend: { position: "top" },
								},
								scales: {
									y: {
										beginAtZero: true,
									},
								},
							}}
						/>
					</Paper>
				</>
			)}
		</Container>
	);
};

export default Dashboard;

/** @format 

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
	const [dashboardData, setDashboardData] = useState({
		totalSales: 0,
		totalPurchases: 0,
		salesReturns: 0,
		purchasesReturns: 0,
		salesByDate: [],
	});

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		const response = await axios.get("http://localhost:5000/dashboard");
		setDashboardData(response.data);
	};

	return (
		<div>
			<h1>Dashboard</h1>

			{/* Summary Cards *
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography variant='h6'>Total Sales</Typography>
							<Typography variant='h4'>
								KES {dashboardData.totalSales}
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography variant='h6'>Total Purchases</Typography>
							<Typography variant='h4'>
								KES {dashboardData.totalPurchases}
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography variant='h6'>Sales Returns</Typography>
							<Typography variant='h4'>
								KES {dashboardData.salesReturns}
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<Card>
						<CardContent>
							<Typography variant='h6'>Purchase Returns</Typography>
							<Typography variant='h4'>
								KES {dashboardData.purchasesReturns}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Sales & Purchases Chart *
			<div style={{ marginTop: "20px" }}>
				<h3>This Week Sales & Purchases</h3>
				<Bar
					data={{
						labels: dashboardData.salesByDate.map((data) => data.date),
						datasets: [
							{
								label: "Sales",
								data: dashboardData.salesByDate.map((data) => data.sales),
								backgroundColor: "rgba(75, 192, 192, 0.6)",
							},
							{
								label: "Purchases",
								data: dashboardData.salesByDate.map((data) => data.purchases),
								backgroundColor: "rgba(153, 102, 255, 0.6)",
							},
						],
					}}
				/>
			</div>
		</div>
	);
};

export default Dashboard;*/
