/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Button,
	TextField,
} from "@mui/material";

const Suppliers = () => {
	const [suppliers, setSuppliers] = useState([]);
	const [error, setError] = useState("");
	const [newSupplier, setNewSupplier] = useState({
		name: "",
		contact: "",
		address: "",
	});
	const [editingSupplier, setEditingSupplier] = useState(null);

	useEffect(() => {
		fetchSuppliers();
	}, []);

	const fetchSuppliers = async () => {
		try {
			const response = await axios.get("http://localhost:5000/supplier");
			setSuppliers(response.data);
			setError("");
		} catch (error) {
			console.error("Error fetching suppliers:", error);
			setError("Failed to fetch suppliers. Please try again.");
		}
	};

	const addSupplier = async () => {
		try {
			await axios.post("http://localhost:5000/supplier", newSupplier);
			setNewSupplier({ name: "", contact: "", address: "" });
			fetchSuppliers();
		} catch (error) {
			console.error("Error adding supplier:", error);
		}
	};

	const deleteSupplier = async (id) => {
		try {
			await axios.delete(`http://localhost:5000/supplier/${id}`);
			setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
		} catch (error) {
			console.error("Error deleting supplier:", error);
		}
	};

	const updateSupplier = async () => {
		try {
			if (!editingSupplier) return;
			await axios.put(
				`http://localhost:5000/suppliers/${editingSupplier.id}`,
				editingSupplier
			);
			setEditingSupplier(null);
			fetchSuppliers();
		} catch (error) {
			console.error("Error updating supplier:", error);
		}
	};

	return (
		<div>
			<h2>Suppliers</h2>

			{error && <p style={{ color: "red" }}>{error}</p>}

			<div style={{ marginBottom: "20px" }}>
				<TextField
					label='Name'
					value={newSupplier.name}
					onChange={(e) =>
						setNewSupplier({ ...newSupplier, name: e.target.value })
					}
					required
				/>
				<TextField
					label='Contact'
					value={newSupplier.contact}
					onChange={(e) =>
						setNewSupplier({ ...newSupplier, contact: e.target.value })
					}
					required
				/>
				<TextField
					label='Address'
					value={newSupplier.address}
					onChange={(e) =>
						setNewSupplier({ ...newSupplier, address: e.target.value })
					}
					required
				/>
				<Button variant='contained' onClick={addSupplier}>
					Add Supplier
				</Button>
			</div>
			{editingSupplier && (
				<div style={{ marginBottom: "20px" }}>
					<h3>Edit Supplier</h3>
					<TextField
						label='Name'
						value={editingSupplier.name}
						onChange={(e) =>
							setEditingSupplier({ ...editingSupplier, name: e.target.value })
						}
						required
					/>
					<TextField
						label='Contact'
						value={editingSupplier.contact}
						onChange={(e) =>
							setEditingSupplier({
								...editingSupplier,
								contact: e.target.value,
							})
						}
						required
					/>
					<TextField
						label='Address'
						value={editingSupplier.address}
						onChange={(e) =>
							setEditingSupplier({
								...editingSupplier,
								address: e.target.value,
							})
						}
						required
					/>
					<Button variant='contained' onClick={updateSupplier}>
						Update Supplier
					</Button>
				</div>
			)}
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>Contact</TableCell>
						<TableCell>Address</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{(suppliers.length > 0 ? suppliers : []).map((supplier) => (
						<TableRow key={supplier.id}>
							<TableCell>{supplier.id}</TableCell>
							<TableCell>{supplier.name}</TableCell>
							<TableCell>{supplier.contact}</TableCell>
							<TableCell>{supplier.address}</TableCell>
							<TableCell>
								<Button
									color='primary'
									onClick={() => setEditingSupplier({ ...supplier })}
								>
									Edit
								</Button>
								<Button
									color='secondary'
									onClick={() => deleteSupplier(supplier.id)}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default Suppliers;

/** @format 

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Button,
	TextField,
} from "@mui/material";

const Suppliers = () => {
	const [suppliers, setSuppliers] = useState([]);
	const [newSupplier, setNewSupplier] = useState({
		name: "",
		contact: "",
		address: "",
	});
	const [editingSupplier, setEditingSupplier] = useState(null);

	useEffect(() => {
		fetchSuppliers();
	}, []);

	const fetchSuppliers = async () => {
		try {
			const response = await axios.get("http://localhost:5000/suppliers");
			console.log("Suppliers data:", response.data);
			setSuppliers(response.data || []);
		} catch (error) {
			console.error("Error fetching suppliers:", error);
			setSuppliers([]);
		}
	};

	const addSupplier = async () => {
		try {
			await axios.post("http://localhost:5000/suppliers", newSupplier);
			setNewSupplier({ name: "", contact: "", address: "" });
			fetchSuppliers();
		} catch (error) {
			console.error("Error adding supplier:", error);
		}
	};

	const deleteSupplier = async (id) => {
		try {
			await axios.delete(`http://localhost:5000/suppliers/${id}`);
			setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
		} catch (error) {
			console.error("Error deleting supplier:", error);
		}
	};

	const updateSupplier = async () => {
		try {
			if (!editingSupplier) return;
			await axios.put(
				`http://localhost:5000/suppliers/${editingSupplier.id}`,
				editingSupplier
			);
			setEditingSupplier(null);
			fetchSuppliers();
		} catch (error) {
			console.error("Error updating supplier:", error);
		}
	};

	return (
		<div>
			<h2>Suppliers</h2>
			<div style={{ marginBottom: "20px" }}>
				<TextField
					label='Name'
					value={newSupplier.name}
					onChange={(e) =>
						setNewSupplier({ ...newSupplier, name: e.target.value })
					}
					required
				/>
				<TextField
					label='Contact'
					value={newSupplier.contact}
					onChange={(e) =>
						setNewSupplier({ ...newSupplier, contact: e.target.value })
					}
					required
				/>
				<TextField
					label='Address'
					value={newSupplier.address}
					onChange={(e) =>
						setNewSupplier({ ...newSupplier, address: e.target.value })
					}
					required
				/>
				<Button variant='contained' onClick={addSupplier}>
					Add Supplier
				</Button>
			</div>
			{editingSupplier && (
				<div style={{ marginBottom: "20px" }}>
					<h3>Edit Supplier</h3>
					<TextField
						label='Name'
						value={editingSupplier.name}
						onChange={(e) =>
							setEditingSupplier({ ...editingSupplier, name: e.target.value })
						}
						required
					/>
					<TextField
						label='Contact'
						value={editingSupplier.contact}
						onChange={(e) =>
							setEditingSupplier({
								...editingSupplier,
								contact: e.target.value,
							})
						}
						required
					/>
					<TextField
						label='Address'
						value={editingSupplier.address}
						onChange={(e) =>
							setEditingSupplier({
								...editingSupplier,
								address: e.target.value,
							})
						}
						required
					/>
					<Button variant='contained' onClick={updateSupplier}>
						Update Supplier
					</Button>
				</div>
			)}
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>Contact</TableCell>
						<TableCell>Address</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						/*Array.isArray(suppliers) &&*suppliers.length > 0 ? (
							suppliers.map((supplier) => (
								<TableRow key={supplier.id}>
									<TableCell>{supplier.id}</TableCell>
									<TableCell>{supplier.name}</TableCell>
									<TableCell>{supplier.contact}</TableCell>
									<TableCell>{supplier.address}</TableCell>
									<TableCell>
										<Button
											color='primary'
											onClick={() => setEditingSupplier(supplier)}
										>
											Edit
										</Button>
										<Button
											color='secondary'
											onClick={() => deleteSupplier(supplier.id)}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} style={{ textAlign: "center" }}>
									No suppliers found.
								</TableCell>
							</TableRow>
						)
					}
				</TableBody>
			</Table>
		</div>
	);
};

export default Suppliers;*/
