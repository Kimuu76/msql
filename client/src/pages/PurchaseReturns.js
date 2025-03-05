/** @format */

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
} from "@mui/material";

const PurchaseReturns = () => {
	const [purchaseReturns, setPurchaseReturns] = useState([]);
	const [purchases, setPurchases] = useState([]);
	const [products, setProducts] = useState([]);
	const [editingReturn, setEditingReturn] = useState(null); // Track which return is being edited
	const [newReturn, setNewReturn] = useState({
		purchaseId: "",
		productId: "",
		quantity: "",
		refundAmount: "",
		reason: "",
	});

	useEffect(() => {
		fetchPurchases();
		fetchPurchaseReturns();
		fetchProducts();
	}, []);

	const fetchPurchases = async () => {
		try {
			const response = await axios.get("http://localhost:5000/purchases");
			console.log("📥 Purchases API Response:", response.data);

			if (Array.isArray(response.data)) {
				setPurchases(response.data);
			} else {
				console.error("Unexpected response format:", response.data);
				setPurchases([]); // Default to an empty array if data is invalid
			}
		} catch (error) {
			console.error("❌ Error fetching purchases:", error);
			setPurchases([]);
		}
	};

	const fetchPurchaseReturns = async () => {
		try {
			const response = await axios.get(
				"http://localhost:5000/purchase-returns"
			);
			console.log("📥 Fetched Purchase Returns:", response.data);

			if (Array.isArray(response.data)) {
				setPurchaseReturns(response.data);
			} else {
				console.error("❌ Unexpected response format:", response.data);
				setPurchaseReturns([]); // Ensure it's an array
			}
		} catch (error) {
			console.error("❌ Error fetching purchase returns:", error);
			setPurchaseReturns([]);
		}
	};

	const fetchProducts = async () => {
		try {
			const response = await axios.get("http://localhost:5000/products");
			setProducts(response.data);
		} catch (error) {
			console.error("❌ Error fetching products:", error);
		}
	};

	// ✅ Process a purchase return
	const processReturn = async () => {
		try {
			if (!newReturn.purchaseId || !newReturn.productId || !newReturn.reason) {
				alert("⚠ Please select a valid purchase, product, and reason!");
				return;
			}

			if (!newReturn.quantity || newReturn.quantity <= 0) {
				alert("⚠ Please enter a valid quantity!");
				return;
			}

			if (!newReturn.refundAmount || newReturn.refundAmount <= 0) {
				alert("⚠ Please enter a valid refund amount!");
				return;
			}

			const returnData = {
				purchaseId: parseInt(newReturn.purchaseId),
				productId: parseInt(newReturn.productId),
				quantity: parseInt(newReturn.quantity),
				refundAmount: parseFloat(newReturn.refundAmount),
				reason: newReturn.reason,
			};

			console.log("🔍 Submitting purchase return:", returnData);

			await axios.post("http://localhost:5000/purchase-returns", returnData);
			alert("✅ Purchase return processed successfully!");

			fetchPurchaseReturns();
			setNewReturn({
				purchaseId: "",
				productId: "",
				quantity: "",
				refundAmount: "",
				reason: "",
			});
		} catch (error) {
			console.error("❌ Error processing purchase return:", error);
			alert("⚠ Failed to process purchase return.");
		}
	};

	// ✅ Delete a purchase return
	const deletePurchaseReturn = async (id) => {
		if (
			!window.confirm(
				"🛑 Are you sure you want to cancel this purchase return?"
			)
		)
			return;

		try {
			await axios.delete(`http://localhost:5000/purchase-returns/${id}`);

			// ✅ Remove the deleted return from UI
			setPurchaseReturns((prevReturns) =>
				prevReturns.filter((pr) => pr.id !== id)
			);

			alert("Purchase return canceled successfully!");
		} catch (error) {
			console.error("Error deleting purchase return:", error);
			alert("Failed to cancel purchase return!");
		}
	};

	// ✅ Edit a purchase return
	const handleEdit = (pr) => {
		setEditingReturn(pr);
	};

	const updatePurchaseReturn = async () => {
		try {
			await axios.put(
				`http://localhost:5000/purchase-returns/${editingReturn.id}`,
				{
					quantity: editingReturn.quantity,
					refundAmount: editingReturn.refundAmount,
					reason: editingReturn.reason,
				}
			);

			setEditingReturn(null);
			fetchPurchaseReturns();
			alert("✅ Purchase return updated successfully!");
		} catch (error) {
			console.error("❌ Error updating purchase return:", error);
			alert("⚠ Failed to update purchase return.");
		}
	};

	return (
		<div>
			<h1>🛒 Purchase Returns</h1>

			{/* Add Purchase Return Form */}
			<div
				style={{
					marginBottom: "20px",
					padding: "10px",
					border: "1px solid #ccc",
					borderRadius: "5px",
				}}
			>
				<h3>➕ Add Purchase Return</h3>
				<TextField
					select
					SelectProps={{ native: true }}
					label='Select a purchase'
					value={newReturn.purchaseId}
					onChange={(e) =>
						setNewReturn({ ...newReturn, purchaseId: e.target.value })
					}
					style={{ marginRight: "10px" }}
				>
					<option value=''>Select a purchase</option>
					{purchases.map((purchase) => (
						<option key={purchase.id} value={purchase.id}>
							Purchase ID: {purchase.id} - {purchase.productName}
						</option>
					))}
				</TextField>

				<TextField
					select
					SelectProps={{ native: true }}
					label='Select a product'
					value={newReturn.productId}
					onChange={(e) =>
						setNewReturn({ ...newReturn, productId: e.target.value })
					}
					style={{ marginRight: "10px" }}
				>
					<option value=''>Select a product</option>
					{products.map((product) => (
						<option key={product.id} value={product.id}>
							{product.name}
						</option>
					))}
				</TextField>

				<TextField
					label='Quantity to Return'
					type='number'
					value={newReturn.quantity}
					onChange={(e) =>
						setNewReturn({ ...newReturn, quantity: e.target.value })
					}
					style={{ marginRight: "10px" }}
				/>

				<TextField
					label='Refund Amount (KES)'
					type='number'
					value={newReturn.refundAmount}
					onChange={(e) =>
						setNewReturn({ ...newReturn, refundAmount: e.target.value })
					}
					style={{ marginRight: "10px" }}
				/>

				<TextField
					label='Reason'
					value={newReturn.reason}
					onChange={(e) =>
						setNewReturn({ ...newReturn, reason: e.target.value })
					}
				/>

				<Button
					variant='contained'
					onClick={processReturn}
					style={{ marginLeft: "10px" }}
				>
					Process Return
				</Button>
			</div>

			{/* Display Purchase Returns Table */}
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>📦 Product Name</TableCell>
						<TableCell>🔢 Quantity</TableCell>
						<TableCell>💰 Refund Amount (KES)</TableCell>
						<TableCell>📄 Reason</TableCell>
						<TableCell>⚙ Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Array.isArray(purchaseReturns) &&
						purchaseReturns.map((pr) => (
							<TableRow key={pr.id}>
								<TableCell>{pr.productName || "Unknown"}</TableCell>
								<TableCell>{pr.quantity}</TableCell>
								<TableCell>
									KES {pr.refundAmount ? pr.refundAmount.toFixed(2) : "0.00"}
								</TableCell>
								<TableCell>{pr.reason}</TableCell>
								<TableCell>
									<Button onClick={() => setEditingReturn(pr)}>✏ Edit</Button>
									<Button
										color='secondary'
										onClick={() => deletePurchaseReturn(pr.id)}
									>
										🗑 Cancel
									</Button>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			{editingReturn && (
				<div
					style={{
						marginTop: "20px",
						padding: "15px",
						border: "1px solid #ccc",
					}}
				>
					<h3>Edit Purchase Return</h3>
					<TextField
						label='Quantity'
						type='number'
						value={editingReturn.quantity}
						onChange={(e) =>
							setEditingReturn({ ...editingReturn, quantity: e.target.value })
						}
					/>
					<TextField
						label='Refund Amount'
						type='number'
						value={editingReturn.refundAmount}
						onChange={(e) =>
							setEditingReturn({
								...editingReturn,
								refundAmount: e.target.value,
							})
						}
					/>
					<TextField
						label='Reason'
						value={editingReturn.reason}
						onChange={(e) =>
							setEditingReturn({ ...editingReturn, reason: e.target.value })
						}
					/>
					<Button variant='contained' onClick={updatePurchaseReturn}>
						Update
					</Button>
					<Button color='secondary' onClick={() => setEditingReturn(null)}>
						Cancel
					</Button>
				</div>
			)}
		</div>
	);
};

export default PurchaseReturns;

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
} from "@mui/material";

const PurchaseReturns = () => {
	const [purchaseReturns, setPurchaseReturns] = useState([]);
	const [purchases, setPurchases] = useState([]);
	const [products, setProducts] = useState([]);
	const [editingReturn, setEditingReturn] = useState(null);
	const [newReturn, setNewReturn] = useState({
		purchaseId: "",
		productId: "",
		quantity: "",
		refundAmount: "",
		reason: "",
	});

	useEffect(() => {
		fetchPurchases();
		fetchPurchaseReturns();
		fetchProducts();
	}, []);

	const fetchPurchases = async () => {
		try {
			const response = await axios.get("http://localhost:5000/purchases");
			setPurchases(response.data);
		} catch (error) {
			console.error("❌ Error fetching purchases:", error);
		}
	};

	const fetchPurchaseReturns = async () => {
		try {
			const response = await axios.get(
				"http://localhost:5000/purchase-returns"
			);
			setPurchaseReturns(response.data);
		} catch (error) {
			console.error("❌ Error fetching purchase returns:", error);
		}
	};

	const fetchProducts = async () => {
		try {
			const response = await axios.get("http://localhost:5000/products");
			setProducts(response.data);
		} catch (error) {
			console.error("❌ Error fetching products:", error);
		}
	};

	// ✅ Process a purchase return
	const processReturn = async () => {
		try {
			if (!newReturn.purchaseId || !newReturn.productId || !newReturn.reason) {
				alert("⚠ Please select a valid purchase, product, and reason!");
				return;
			}

			if (!newReturn.quantity || newReturn.quantity <= 0) {
				alert("⚠ Please enter a valid quantity!");
				return;
			}

			if (!newReturn.refundAmount || newReturn.refundAmount <= 0) {
				alert("⚠ Please enter a valid refund amount!");
				return;
			}

			const returnData = {
				purchaseId: parseInt(newReturn.purchaseId),
				productId: parseInt(newReturn.productId),
				quantity: parseInt(newReturn.quantity),
				refundAmount: parseFloat(newReturn.refundAmount),
				reason: newReturn.reason,
			};

			console.log("🔍 Submitting purchase return:", returnData);

			await axios.post("http://localhost:5000/purchase-returns", returnData);
			alert("✅ Purchase return processed successfully!");

			fetchPurchaseReturns();
			setNewReturn({
				purchaseId: "",
				productId: "",
				quantity: "",
				refundAmount: "",
				reason: "",
			});
		} catch (error) {
			console.error("❌ Error processing purchase return:", error);
			alert("⚠ Failed to process purchase return.");
		}
	};

	// ✅ Delete a purchase return
	const deletePurchaseReturn = async (id) => {
		if (
			!window.confirm(
				"🛑 Are you sure you want to cancel this purchase return?"
			)
		)
			return;

		try {
			await axios.delete(`http://localhost:5000/purchase-returns/${id}`);
			alert("✅ Purchase return canceled successfully!");
			fetchPurchaseReturns();
		} catch (error) {
			console.error("❌ Error deleting purchase return:", error);
			alert("⚠ Failed to cancel purchase return!");
		}
	};

	// ✅ Edit a purchase return
	const handleEdit = (pr) => {
		setEditingReturn(pr);
	};

	const updatePurchaseReturn = async () => {
		if (!editingReturn) return;

		try {
			await axios.put(
				`http://localhost:5000/purchase-returns/${editingReturn.id}`,
				editingReturn
			);

			setEditingReturn(null);
			fetchPurchaseReturns();
			alert("✅ Purchase return updated successfully!");
		} catch (error) {
			console.error("❌ Error updating purchase return:", error);
			alert("⚠ Failed to update purchase return.");
		}
	};

	return (
		<div>
			<h1>🛒 Purchase Returns</h1>

			{/* Add Purchase Return Form *
			<div
				style={{
					marginBottom: "20px",
					padding: "10px",
					border: "1px solid #ccc",
					borderRadius: "5px",
				}}
			>
				<h3>➕ Add Purchase Return</h3>
				<TextField
					select
					SelectProps={{ native: true }}
					label='Select a purchase'
					value={newReturn.purchaseId}
					onChange={(e) =>
						setNewReturn({ ...newReturn, purchaseId: e.target.value })
					}
					style={{ marginRight: "10px" }}
				>
					<option value=''>Select a purchase</option>
					{purchases.map((purchase) => (
						<option key={purchase.id} value={purchase.id}>
							Purchase ID: {purchase.id} - {purchase.productName}
						</option>
					))}
				</TextField>

				<TextField
					select
					SelectProps={{ native: true }}
					label='Select a product'
					value={newReturn.productId}
					onChange={(e) =>
						setNewReturn({ ...newReturn, productId: e.target.value })
					}
					style={{ marginRight: "10px" }}
				>
					<option value=''>Select a product</option>
					{products.map((product) => (
						<option key={product.id} value={product.id}>
							{product.name}
						</option>
					))}
				</TextField>

				<TextField
					label='Quantity to Return'
					type='number'
					value={newReturn.quantity}
					onChange={(e) =>
						setNewReturn({ ...newReturn, quantity: e.target.value })
					}
					style={{ marginRight: "10px" }}
				/>

				<TextField
					label='Refund Amount (KES)'
					type='number'
					value={newReturn.refundAmount}
					onChange={(e) =>
						setNewReturn({ ...newReturn, refundAmount: e.target.value })
					}
					style={{ marginRight: "10px" }}
				/>

				<TextField
					label='Reason'
					value={newReturn.reason}
					onChange={(e) =>
						setNewReturn({ ...newReturn, reason: e.target.value })
					}
				/>

				<Button
					variant='contained'
					onClick={processReturn}
					style={{ marginLeft: "10px" }}
				>
					Process Return
				</Button>
			</div>

			{/* Display Purchase Returns Table *
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>📦 Product Name</TableCell>
						<TableCell>🔢 Quantity</TableCell>
						<TableCell>💰 Refund Amount</TableCell>
						<TableCell>📄 Reason</TableCell>
						<TableCell>⚙ Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{purchaseReturns.map((pr) => (
						<TableRow key={pr.id}>
							<TableCell>{pr.productName || "Unknown"}</TableCell>
							<TableCell>{pr.quantity}</TableCell>
							<TableCell>KES {pr.refundAmount}</TableCell>
							<TableCell>{pr.reason}</TableCell>
							<TableCell>
								<Button onClick={() => handleEdit(pr)}>✏ Edit</Button>
								<Button
									color='secondary'
									onClick={() => deletePurchaseReturn(pr.id)}
								>
									🗑 Cancel
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default PurchaseReturns;*/
