/** @format */

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	TextField,
	Typography,
	Box,
	Container,
	Paper,
	MenuItem,
	Select,
	Alert,
	Snackbar,
	IconButton,
} from "@mui/material";
import { Delete, CheckCircle, Print } from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import Receipt from "../components/Receipt";

const Sales = () => {
	const [sales, setSales] = useState([]);
	const [products, setProducts] = useState([]);
	const [selectedProducts, setSelectedProducts] = useState([]); // ✅ Store multiple products
	const [receipts, setReceipts] = useState([]);
	const [error, setError] = useState("");
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		type: "success",
	});

	// Ref for printing receipt
	const receiptRef = useRef();

	// Print function
	const handlePrint = useReactToPrint({
		content: () => receiptRef.current,
	});

	// ✅ Auto-print when a new receipt is added
	useEffect(() => {
		if (receipts.length > 0) {
			if (receiptRef.current) {
				setTimeout(() => {
					handlePrint();
				}, 500);
			}
		}
	}, [receipts]); // 🔥 Runs every time a new receipt is added

	// Fetch sales and products
	useEffect(() => {
		fetchSales();
		fetchProducts();
	}, []);

	const fetchSales = async () => {
		const response = await axios.get("http://localhost:5000/sales");
		setSales(response.data);
	};

	const fetchProducts = async () => {
		const response = await axios.get("http://localhost:5000/products");
		setProducts(response.data);
	};

	// ✅ Add Product to Sale List
	const addProductToSale = () => {
		setSelectedProducts([...selectedProducts, { productId: "", quantity: 1 }]);
	};

	// ✅ Remove a Product from Sale List
	const removeProductFromSale = (index) => {
		const updatedProducts = [...selectedProducts];
		updatedProducts.splice(index, 1);
		setSelectedProducts(updatedProducts);
	};

	// ✅ Update Product Details
	const updateProductDetails = (index, field, value) => {
		const updatedProducts = [...selectedProducts];
		updatedProducts[index][field] = value;
		setSelectedProducts(updatedProducts);
	};

	// ✅ Calculate Total Amount for Sale
	const calculateTotal = () => {
		return selectedProducts
			.reduce((total, item) => {
				const product = products.find((p) => p.id === item.productId);
				return total + (product ? product.sellingPrice * item.quantity : 0);
			}, 0)
			.toFixed(2);
	};

	// ✅ Process Sale (Submit Multiple Products)
	const processSale = async () => {
		if (selectedProducts.length === 0) {
			setError("⚠️ Please add at least one product.");
			return;
		}

		try {
			const saleItems = selectedProducts.map((item) => ({
				productId: item.productId,
				quantity: item.quantity,
			}));

			const response = await axios.post("http://localhost:5000/sales", {
				items: saleItems,
			});

			setReceipts([response.data.receipt]); // ✅ Save the receipt

			setSnackbar({
				open: true,
				message: "✅ Sale recorded successfully!",
				type: "success",
			});
			setSelectedProducts([]);
			fetchSales();
		} catch (error) {
			console.error("❌ Error processing sale:", error);
			setSnackbar({
				open: true,
				message: "❌ Failed to record sale.",
				type: "error",
			});
		}
	};

	return (
		<Container maxWidth='md'>
			<Typography variant='h4' align='center' gutterBottom>
				🛒 Sales Management
			</Typography>

			{/* Add Sale Form */}
			<Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
				<Typography variant='h6' gutterBottom>
					Record New Sale
				</Typography>

				{error && <Alert severity='error'>{error}</Alert>}

				<Box
					display='flex'
					flexDirection='column'
					gap={2}
					sx={{ marginTop: 2 }}
				>
					{selectedProducts.map((item, index) => (
						<Box
							key={index}
							display='flex'
							alignItems='center'
							gap={2}
							sx={{ borderBottom: "1px solid #ddd", paddingBottom: 1 }}
						>
							{/* Select Product */}
							<Select
								value={item.productId}
								onChange={(e) =>
									updateProductDetails(index, "productId", e.target.value)
								}
								displayEmpty
								fullWidth
							>
								<MenuItem value='' disabled>
									Select Product
								</MenuItem>
								{products.map((product) => (
									<MenuItem key={product.id} value={product.id}>
										{product.name} - KES {product.sellingPrice}
									</MenuItem>
								))}
							</Select>

							{/* Quantity */}
							<TextField
								label='Quantity'
								type='number'
								value={item.quantity}
								onChange={(e) =>
									updateProductDetails(index, "quantity", e.target.value)
								}
								fullWidth
							/>

							{/* Remove Product */}
							<IconButton
								color='error'
								onClick={() => removeProductFromSale(index)}
							>
								<Delete />
							</IconButton>
						</Box>
					))}

					{/* Add More Products */}
					<Button
						variant='contained'
						color='secondary'
						onClick={addProductToSale}
						sx={{ alignSelf: "center" }}
					>
						➕ Add Product
					</Button>

					{/* Display Total */}
					<Typography variant='h6' sx={{ textAlign: "right" }}>
						Total Amount: <strong>KES {calculateTotal()}</strong>
					</Typography>

					{/* Submit Sale */}
					<Button variant='contained' color='primary' onClick={processSale}>
						<CheckCircle /> Process Sale
					</Button>
				</Box>
			</Paper>

			{/* Sales Table */}
			<Paper elevation={3} sx={{ padding: 2 }}>
				<Typography variant='h6' gutterBottom>
					Sales Records
				</Typography>
				<Table>
					<TableHead>
						<TableRow sx={{ backgroundColor: "#f5f5f5" }}>
							<TableCell>Product Name</TableCell>
							<TableCell>Quantity</TableCell>
							<TableCell>Total Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sales.length === 0 ? (
							<TableRow>
								<TableCell colSpan={3} align='center'>
									No sales recorded.
								</TableCell>
							</TableRow>
						) : (
							sales.map((sale) => (
								<TableRow key={sale.id}>
									<TableCell>{sale.productName}</TableCell>
									<TableCell>{sale.quantity}</TableCell>
									<TableCell>KES {sale.totalAmount}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Paper>

			{/* Print Receipt */}
			{receipts.length > 0 && (
				<Box sx={{ textAlign: "center", marginTop: 2 }}>
					<Button
						variant='contained'
						color='primary'
						startIcon={<Print />}
						onClick={handlePrint}
					>
						🖨️ Print Receipt
					</Button>
					<Receipt ref={receiptRef} receipt={receipts[0]} autoPrint={true} />

					{/*<Receipt ref={receiptRef} receipt={receipts[0]} />*/}
				</Box>
			)}

			<Snackbar
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				message={snackbar.message}
				severity={snackbar.type}
			/>
		</Container>
	);
};

export default Sales;

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
	Snackbar,
	IconButton,
} from "@mui/material";
import { Delete, Edit, CheckCircle } from "@mui/icons-material";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import Receipt from "../components/Receipt";

const Sales = () => {
	const [sales, setSales] = useState([]);
	const [products, setProducts] = useState([]);
	const [selectedProducts, setSelectedProducts] = useState([]); // ✅ Store multiple products
	const [receipts, setReceipts] = useState([]);
	const [newSale, setNewSale] = useState({
		productId: "",
		quantity: "",
	});
	const [error, setError] = useState("");
	const [editingSale, setEditingSale] = useState(null);
	const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		type: "success",
	});
	// Ref for printing receipt
	const receiptRef = useRef();

	// Print function
	const handlePrint = useReactToPrint({
		content: () => receiptRef.current,
	});

	// Fetch sales and products
	useEffect(() => {
		fetchSales();
		fetchProducts();
	}, []);

	const fetchSales = async () => {
		const response = await axios.get("http://localhost:5000/sales");
		setSales(response.data);
	};

	const fetchProducts = async () => {
		const response = await axios.get("http://localhost:5000/products");
		setProducts(response.data);
	};

	// Calculate total price dynamically
	const calculateTotal = () => {
		const product = products.find((p) => p.id === newSale.productId);
		return product ? (product.sellingPrice * newSale.quantity).toFixed(2) : "";
	};

	// Add a new sale
	const addSale = async () => {
		const { productId, quantity } = newSale;

		if (!productId || !quantity) {
			setError("⚠️ Please fill in all fields correctly.");
			return;
		}

		setError("");

		try {
			const selectedProduct = products.find((p) => p.id === productId);

			const response = await axios.post("http://localhost:5000/sales", {
				productId,
				productName: selectedProduct ? selectedProduct.name : "Unknown",
				quantity,
			});

			console.log("✅ Receipt Data:", response.data.receipt); // Debugging

			if (!response.data.receipt) {
				alert("⚠️ No receipt data returned from the server.");
				return;
			}
			// ✅ Save receipt but don't auto-display it
			setReceipts([response.data.receipt]);

			setReceipts([...receipts, response.data.receipt]);
			setNewSale({ productId: "", quantity: "" });

			fetchSales();
			setSnackbar({
				open: true,
				message: "✅ Sale recorded successfully!",
				type: "success",
			});
		} catch (error) {
			console.error("❌ Error adding sale:", error);
			setSnackbar({
				open: true,
				message: "❌ Failed to record sale.",
				type: "error",
			});
		}
	};

	// Delete a sale
	const confirmDelete = (id) => setDeleteConfirm({ open: true, id });

	const deleteSale = async () => {
		try {
			const { id } = deleteConfirm;
			setDeleteConfirm({ open: false, id: null });

			await axios.delete(`http://localhost:5000/sales/${id}`);

			setSnackbar({
				open: true,
				message: "✅ Sale deleted successfully!",
				type: "success",
			});
			fetchSales();
		} catch (error) {
			console.error("❌ Error deleting sale:", error);
			setSnackbar({
				open: true,
				message: "❌ Failed to delete sale!",
				type: "error",
			});
		}
	};

	// Edit a sale
	const handleEdit = (sale) => {
		setEditingSale(sale);
	};

	const updateSale = async () => {
		try {
			await axios.put(`http://localhost:5000/sales/${editingSale.id}`, {
				productId: editingSale.productId,
				quantity: editingSale.quantity,
			});

			setSnackbar({
				open: true,
				message: "✅ Sale updated successfully!",
				type: "success",
			});
			setEditingSale(null);
			fetchSales();
		} catch (error) {
			console.error("❌ Error updating sale:", error);
			setSnackbar({
				open: true,
				message: "❌ Failed to update sale!",
				type: "error",
			});
		}
	};

	return (
		<Container maxWidth='md'>
			<Typography variant='h4' align='center' gutterBottom>
				🛒 Sales Management
			</Typography>

			{/* Add Sale Form 
			<Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
				<Typography variant='h6' gutterBottom>
					Record New Sale
				</Typography>

				{error && <Alert severity='error'>{error}</Alert>}

				<Box display='flex' flexWrap='wrap' gap={2} sx={{ marginTop: 2 }}>
					<TextField
						select
						fullWidth
						label='Select Product'
						value={newSale.productId}
						onChange={(e) =>
							setNewSale({ ...newSale, productId: e.target.value })
						}
					>
						{products.map((product) => (
							<MenuItem key={product.id} value={product.id}>
								{product.name}
							</MenuItem>
						))}
					</TextField>

					<TextField
						label='Quantity'
						type='number'
						fullWidth
						value={newSale.quantity}
						onChange={(e) =>
							setNewSale({ ...newSale, quantity: e.target.value })
						}
					/>

					<TextField
						label='Total Amount (Auto)'
						type='number'
						fullWidth
						value={calculateTotal()}
						disabled
					/>

					<Button variant='contained' color='primary' onClick={addSale}>
						<CheckCircle /> Add Sale
					</Button>
				</Box>
			</Paper>

			{/* Sales Table *
			<Paper elevation={3} sx={{ padding: 2 }}>
				<Typography variant='h6' gutterBottom>
					Sales Records
				</Typography>
				<Table>
					<TableHead>
						<TableRow sx={{ backgroundColor: "#f5f5f5" }}>
							<TableCell>Product Name</TableCell>
							<TableCell>Quantity</TableCell>
							<TableCell>Total Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sales.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} align='center'>
									No sales recorded.
								</TableCell>
							</TableRow>
						) : (
							sales.map((sale) => (
								<TableRow key={sale.id}>
									<TableCell>{sale.productName}</TableCell>
									<TableCell>{sale.quantity}</TableCell>
									<TableCell>KES {sale.totalAmount}</TableCell>
									{/*<TableCell>
										<IconButton
											color='error'
											onClick={() => confirmDelete(sale.id)}
										>
											<Delete />
										</IconButton>
									</TableCell>*
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Paper>
			<Button variant='contained' onClick={handlePrint}>
				🖨️ Print Receipt
			</Button>

			{receipts.length > 0 && (
				<Receipt ref={receiptRef} receipt={receipts[0]} />
			)}

			{/* Delete Confirmation Dialog 
			<Dialog
				open={deleteConfirm.open}
				onClose={() => setDeleteConfirm({ open: false, id: null })}
			>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogActions>
					<Button onClick={() => setDeleteConfirm({ open: false, id: null })}>
						Cancel
					</Button>
					<Button onClick={deleteSale} color='error'>
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				message={snackbar.message}
				severity={snackbar.type}
			/>
		</Container>
	);
};

export default Sales;*/
