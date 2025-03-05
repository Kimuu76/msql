/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
	Box,
	Container,
	Paper,
	MenuItem,
	Alert,
} from "@mui/material";

const SalesReturns = () => {
	const [sales, setSales] = useState([]);
	const [salesReturns, setSalesReturns] = useState([]);
	const [newReturn, setNewReturn] = useState({
		saleId: "",
		returnQuantity: "",
		reason: "",
	});
	const [error, setError] = useState("");
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		type: "success",
	});

	// Fetch sales and sales returns
	useEffect(() => {
		fetchSales();
		fetchSalesReturns();
	}, []);

	const fetchSales = async () => {
		try {
			const response = await axios.get("http://localhost:5000/sales");
			setSales(response.data);
		} catch (error) {
			console.error("Error fetching sales:", error);
		}
	};

	const fetchSalesReturns = async () => {
		try {
			const response = await axios.get("http://localhost:5000/sales-returns");
			console.log("✅ Sales Returns Data:", response.data); // Debugging

			if (!response.data || response.data.length === 0) {
				console.warn("⚠️ No sales returns found.");
			}

			setSalesReturns(response.data);
		} catch (error) {
			console.error("❌ Error fetching sales returns:", error);
		}
	};

	// Process Sale Return
	const processReturn = async () => {
		const { saleId, returnQuantity, reason } = newReturn;

		if (!saleId || !returnQuantity || !reason) {
			setError("⚠️ Please fill in all fields.");
			return;
		}

		setError("");

		try {
			const response = await axios.post("http://localhost:5000/sales-returns", {
				saleId,
				returnQuantity,
				reason,
			});

			setSalesReturns([...salesReturns, response.data.salesReturn]);
			setNewReturn({ saleId: "", returnQuantity: "", reason: "" });
			fetchSalesReturns();
			setSnackbar({
				open: true,
				message: "✅ Sale return processed successfully!",
				type: "success",
			});
		} catch (error) {
			console.error("❌ Error processing return:", error);
			setSnackbar({
				open: true,
				message: "❌ Failed to process sale return!",
				type: "error",
			});
		}
	};

	return (
		<Container maxWidth='md'>
			<Typography variant='h4' align='center' gutterBottom>
				🔄 Sales Returns
			</Typography>

			{/* Add Sale Return Form */}
			<Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
				<Typography variant='h6' gutterBottom>
					Process Sale Return
				</Typography>

				{error && <Alert severity='error'>{error}</Alert>}

				<Box display='flex' flexWrap='wrap' gap={2} sx={{ marginTop: 2 }}>
					<TextField
						select
						fullWidth
						label='Select Sale'
						value={newReturn.saleId}
						onChange={(e) =>
							setNewReturn({ ...newReturn, saleId: e.target.value })
						}
					>
						{sales.map((sale) => (
							<MenuItem key={sale.id} value={sale.id}>
								{sale.productName} - {sale.quantity} pcs
							</MenuItem>
						))}
					</TextField>

					<TextField
						label='Return Quantity'
						type='number'
						fullWidth
						value={newReturn.returnQuantity}
						onChange={(e) =>
							setNewReturn({ ...newReturn, returnQuantity: e.target.value })
						}
					/>

					<TextField
						label='Refund Amount'
						fullWidth
						value={newReturn.reason}
						onChange={(e) =>
							setNewReturn({ ...newReturn, reason: e.target.value })
						}
					/>

					<Button variant='contained' color='primary' onClick={processReturn}>
						Process Return
					</Button>
				</Box>
			</Paper>

			{/* Sales Returns Table */}
			<Paper elevation={3} sx={{ padding: 2 }}>
				<Typography variant='h6' gutterBottom>
					Returned Sales
				</Typography>
				<Table>
					<TableHead>
						<TableRow sx={{ backgroundColor: "#f5f5f5" }}>
							<TableCell>Product Name</TableCell>
							<TableCell>Returned Quantity</TableCell>
							<TableCell>Refund Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{salesReturns.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} align='center'>
									No sales returns recorded.
								</TableCell>
							</TableRow>
						) : (
							salesReturns.map((returnItem) => (
								<TableRow key={returnItem.id}>
									<TableCell>{returnItem.productName}</TableCell>
									<TableCell>{returnItem.quantity}</TableCell>
									<TableCell>KES {returnItem.refundAmount}</TableCell>
									<TableCell>{returnItem.reason}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Paper>
		</Container>
	);
};

export default SalesReturns;

/** @format 
import { useEffect, useState } from "react";
import axios from "axios";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	TextField,
	Grid,
	Paper,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";

const SalesReturns = () => {
	const [salesReturns, setSalesReturns] = useState([]);
	const [sales, setSales] = useState([]);
	const [newReturn, setNewReturn] = useState({
		saleId: "",
		productId: "",
		quantity: "",
		refundAmount: "",
	});

	// State for Edit Dialog
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editData, setEditData] = useState({
		id: "",
		quantity: "",
		refundAmount: "",
	});

	useEffect(() => {
		fetchSales();
		fetchSalesReturns();
	}, []);

	const fetchSales = async () => {
		const response = await axios.get("http://localhost:5000/sales");
		setSales(response.data);
	};

	const fetchSalesReturns = async () => {
		const response = await axios.get("http://localhost:5000/sales-returns");
		setSalesReturns(response.data);
	};

	// ✅ Delete a sales return
	const deleteSalesReturn = async (id) => {
		if (!window.confirm("Are you sure you want to cancel this sales return?"))
			return;
		try {
			await axios.delete(`http://localhost:5000/sales-returns/${id}`);
			alert("Sales return canceled successfully!");
			fetchSalesReturns(); // Refresh list
		} catch (error) {
			console.error("Error deleting sales return:", error);
			alert("Failed to cancel sales return!");
		}
	};

	// ✅ Handle Edit Click - Open Dialog
	const handleEdit = (sr) => {
		setEditData({
			id: sr.id,
			quantity: sr.quantity,
			refundAmount: sr.refundAmount,
		});
		setEditDialogOpen(true);
	};

	// ✅ Handle Edit Submission
	const handleEditSubmit = async () => {
		try {
			await axios.put(`http://localhost:5000/sales-returns/${editData.id}`, {
				quantity: editData.quantity,
				refundAmount: editData.refundAmount,
			});
			alert("Sales return updated successfully!");
			fetchSalesReturns();
			setEditDialogOpen(false);
		} catch (error) {
			console.error("Error updating sales return:", error);
			alert("Failed to update sales return!");
		}
	};

	// ✅ Process a new sales return
	const processReturn = async () => {
		try {
			const returnData = {
				saleId: parseInt(newReturn.saleId) || 0,
				productId:
					sales.find((s) => s.id === parseInt(newReturn.saleId))?.productId ||
					0,
				quantity: parseInt(newReturn.quantity) || 0,
				refundAmount: parseFloat(newReturn.refundAmount) || 0,
			};

			console.log("🔍 Submitting sales return:", returnData);

			if (returnData.quantity <= 0 || returnData.refundAmount < 0) {
				alert("Invalid quantity or refund amount!");
				return;
			}

			await axios.post("http://localhost:5000/sales-returns", returnData);
			alert("Sales return processed successfully!");

			fetchSalesReturns();
			setNewReturn({
				saleId: "",
				productId: "",
				quantity: "",
				refundAmount: "",
			});
		} catch (error) {
			console.error("Error processing sales return:", error);
			alert("Failed to process sales return.");
		}
	};

	return (
		<Grid container spacing={3} justifyContent='center'>
			{/* Sales Returns Form 
			<Grid item xs={12} md={8}>
				<Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
					<Typography variant='h5' gutterBottom>
						Process Sales Return
					</Typography>

					<Grid container spacing={2}>
						{/* Select Sale *
						<Grid item xs={12} sm={6}>
							<TextField
								select
								fullWidth
								/*label='Select a Sale'
								SelectProps={{ native: true }}
								value={newReturn.saleId}
								onChange={(e) => {
									const selectedSale = sales.find(
										(s) => s.id === parseInt(e.target.value)
									);
									setNewReturn({
										...newReturn,
										saleId: e.target.value,
										productName: selectedSale ? selectedSale.productName : "",
									});
								}}
							>
								<option value=''>Select a sale</option>
								{sales.map((sale) => (
									<option key={sale.id} value={sale.id}>
										{sale.productName}
									</option>
								))}
							</TextField>
						</Grid>

						{/* Quantity 
						<Grid item xs={12} sm={3}>
							<TextField
								fullWidth
								label='Quantity'
								type='number'
								value={newReturn.quantity}
								onChange={(e) =>
									setNewReturn({ ...newReturn, quantity: e.target.value })
								}
							/>
						</Grid>

						{/* Refund Amount 
						<Grid item xs={12} sm={3}>
							<TextField
								fullWidth
								label='Refund Amount'
								type='number'
								value={newReturn.refundAmount}
								onChange={(e) =>
									setNewReturn({ ...newReturn, refundAmount: e.target.value })
								}
							/>
						</Grid>

						{/* Process Return Button
						<Grid item xs={12}>
							<Button
								variant='contained'
								color='primary'
								fullWidth
								onClick={processReturn}
							>
								Process Return
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</Grid>

			{/* Sales Returns Table 
			<Grid item xs={12} md={10}>
				<Paper elevation={3} style={{ padding: "20px" }}>
					<Typography variant='h5' gutterBottom>
						Sales Returns
					</Typography>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Product Name</TableCell>
								<TableCell>Quantity</TableCell>
								<TableCell>Refund Amount</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{salesReturns.map((sr) => (
								<TableRow key={sr.id}>
									<TableCell>{sr.productName || "Unknown"}</TableCell>
									<TableCell>{sr.quantity}</TableCell>
									<TableCell>KES {sr.refundAmount}</TableCell>
									<TableCell>
										<Button
											variant='outlined'
											color='secondary'
											onClick={() => deleteSalesReturn(sr.id)}
										>
											❌ Cancel
										</Button>
										<Button
											variant='contained'
											color='primary'
											onClick={() => handleEdit(sr)}
											style={{ marginLeft: "10px" }}
										>
											✏ Edit
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Paper>
			</Grid>

			{/* Edit Dialog 
			<Dialog
				open={editDialogOpen}
				onClose={() => setEditDialogOpen(false)}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle
					sx={{
						backgroundColor: "#1976d2",
						color: "#fff",
						textAlign: "center",
						spacing: "2",
					}}
				>
					Edit Sales Return
				</DialogTitle>
				<DialogContent sx={{ padding: "15px" }}>
					<Grid container spacing={2}>
						{/* Quantity Field 
						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Quantity'
								type='number'
								value={editData.quantity}
								onChange={(e) =>
									setEditData({ ...editData, quantity: e.target.value })
								}
							/>
						</Grid>
						{/* Refund Amount Field 
						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Refund Amount'
								type='number'
								value={editData.refundAmount}
								onChange={(e) =>
									setEditData({ ...editData, refundAmount: e.target.value })
								}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions
					sx={{ padding: "20px", justifyContent: "space-between" }}
				>
					<Button
						onClick={handleEditSubmit}
						variant='contained'
						color='primary'
					>
						Save Changes
					</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	);
};

export default SalesReturns;*/
