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
	Select,
	MenuItem,
} from "@mui/material";

const StockPrices = () => {
	const [products, setProducts] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState("");
	const [stockPrice, setStockPrice] = useState({
		stock: 0,
		purchasePrice: "",
		sellingPrice: "",
	});

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const response = await axios.get("http://localhost:5000/products");
			setProducts(response.data);
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};

	const updateStockPrice = async () => {
		if (!selectedProduct) {
			alert("Please select a product!");
			return;
		}

		try {
			await axios.put(
				`http://localhost:5000/stock-prices/${selectedProduct}`,
				stockPrice
			);
			alert("Stock and prices updated successfully!");
			fetchProducts();
			setStockPrice({ stock: 0, purchasePrice: "", sellingPrice: "" });
		} catch (error) {
			console.error("Error updating stock and prices:", error);
			alert("Failed to update stock and prices!");
		}
	};

	return (
		<div>
			<h2>Manage Stock & Prices</h2>

			<Select
				value={selectedProduct}
				onChange={(e) => setSelectedProduct(e.target.value)}
				displayEmpty
			>
				<MenuItem value='' disabled>
					Select a product
				</MenuItem>
				{products.map((product) => (
					<MenuItem key={product.id} value={product.id}>
						{product.name}
					</MenuItem>
				))}
			</Select>

			<TextField
				label='Stock Quantity'
				type='number'
				value={stockPrice.stock}
				onChange={(e) =>
					setStockPrice({ ...stockPrice, stock: e.target.value })
				}
				disabled // Stock is updated through purchases
			/>
			<TextField
				label='Purchase Price'
				type='number'
				value={stockPrice.purchasePrice}
				onChange={(e) =>
					setStockPrice({ ...stockPrice, purchasePrice: e.target.value })
				}
			/>
			<TextField
				label='Selling Price'
				type='number'
				value={stockPrice.sellingPrice}
				onChange={(e) =>
					setStockPrice({ ...stockPrice, sellingPrice: e.target.value })
				}
			/>

			<Button variant='contained' onClick={updateStockPrice}>
				Update Stock & Prices
			</Button>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Product Name</TableCell>
						<TableCell>Stock</TableCell>
						<TableCell>Purchase Price</TableCell>
						<TableCell>Selling Price</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{products.map((product) => (
						<TableRow key={product.id}>
							<TableCell>{product.name}</TableCell>
							<TableCell>{product.stock}</TableCell>
							<TableCell>KES {product.purchasePrice}</TableCell>
							<TableCell>KES {product.sellingPrice}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default StockPrices;

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
	Select,
	MenuItem,
} from "@mui/material";

const StockPrices = () => {
	const [products, setProducts] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState("");
	const [stockPrice, setStockPrice] = useState({
		stock: 0,
		purchasePrice: "",
		sellingPrice: "",
	});

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const response = await axios.get("http://localhost:5000/products");
			setProducts(response.data);
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};

	const updateStockPrice = async () => {
		if (!selectedProduct) {
			alert("Please select a product!");
			return;
		}

		try {
			await axios.put(
				`http://localhost:5000/stock-prices/${selectedProduct}`,
				stockPrice
			);
			alert("Stock and prices updated successfully!");
			fetchProducts();
			setStockPrice({ stock: 0, purchasePrice: "", sellingPrice: "" });
		} catch (error) {
			console.error("Error updating stock and prices:", error);
			alert("Failed to update stock and prices!");
		}
	};

	return (
		<div>
			<h2>Manage Stock & Prices</h2>

			<Select
				value={selectedProduct}
				onChange={(e) => setSelectedProduct(e.target.value)}
				displayEmpty
			>
				<MenuItem value='' disabled>
					Select a product
				</MenuItem>
				{products.map((product) => (
					<MenuItem key={product.id} value={product.id}>
						{product.name}
					</MenuItem>
				))}
			</Select>

			<TextField
				label='Stock Quantity'
				type='number'
				value={stockPrice.stock}
				onChange={(e) =>
					setStockPrice({ ...stockPrice, stock: e.target.value })
				}
				disabled // Stock is updated through purchases
			/>
			<TextField
				label='Purchase Price'
				type='number'
				value={stockPrice.purchasePrice}
				onChange={(e) =>
					setStockPrice({ ...stockPrice, purchasePrice: e.target.value })
				}
			/>
			<TextField
				label='Selling Price'
				type='number'
				value={stockPrice.sellingPrice}
				onChange={(e) =>
					setStockPrice({ ...stockPrice, sellingPrice: e.target.value })
				}
			/>

			<Button variant='contained' onClick={updateStockPrice}>
				Update Stock & Prices
			</Button>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Product Name</TableCell>
						<TableCell>Stock</TableCell>
						<TableCell>Purchase Price</TableCell>
						<TableCell>Selling Price</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{products.map((product) => (
						<TableRow key={product.id}>
							<TableCell>{product.name}</TableCell>
							<TableCell>{product.stock}</TableCell>
							<TableCell>KES {product.purchasePrice}</TableCell>
							<TableCell>KES {product.sellingPrice}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default StockPrices;*/

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
	Select,
	MenuItem,
} from "@mui/material";

const StockPrices = () => {
	const [products, setProducts] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState("");
	const [stockPrice, setStockPrice] = useState({
		stock: "",
		purchasePrice: "",
		sellingPrice: "",
	});

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const response = await axios.get("http://localhost:5000/products");
			setProducts(response.data);
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};

	const updateStockPrice = async () => {
		if (!selectedProduct) {
			alert("Please select a product!");
			return;
		}

		try {
			await axios.put(
				`http://localhost:5000/stock-prices/${selectedProduct}`,
				stockPrice
			);
			alert("Stock and prices updated successfully!");
			fetchProducts();
			setStockPrice({ stock: "", purchasePrice: "", sellingPrice: "" });
		} catch (error) {
			console.error("Error updating stock and prices:", error);
			alert("Failed to update stock and prices!");
		}
	};

	return (
		<div>
			<h2>Manage Stock & Prices</h2>

			{/* Select Product 
			<Select
				value={selectedProduct}
				onChange={(e) => setSelectedProduct(e.target.value)}
				displayEmpty
			>
				<MenuItem value='' disabled>
					Select a product
				</MenuItem>
				{products.map((product) => (
					<MenuItem key={product.id} value={product.id}>
						{product.name}
					</MenuItem>
				))}
			</Select>

			{/* Update Stock & Prices 
			<TextField
				label='Stock Quantity'
				type='number'
				value={stockPrice.stock}
				onChange={(e) =>
					setStockPrice({ ...stockPrice, stock: e.target.value })
				}
			/>
			<TextField
				label='Purchase Price'
				type='number'
				value={stockPrice.purchasePrice}
				onChange={(e) =>
					setStockPrice({ ...stockPrice, purchasePrice: e.target.value })
				}
			/>
			<TextField
				label='Selling Price'
				type='number'
				value={stockPrice.sellingPrice}
				onChange={(e) =>
					setStockPrice({ ...stockPrice, sellingPrice: e.target.value })
				}
			/>

			<Button variant='contained' onClick={updateStockPrice}>
				Update Stock & Prices
			</Button>

			{/* Display Stock & Prices 
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Product Name</TableCell>
						<TableCell>Stock</TableCell>
						<TableCell>Purchase Price</TableCell>
						<TableCell>Selling Price</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{products.map((product) => (
						<TableRow key={product.id}>
							<TableCell>{product.name}</TableCell>
							<TableCell>{product.stock}</TableCell>
							<TableCell>KES {product.purchasePrice}</TableCell>
							<TableCell>KES {product.sellingPrice}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default StockPrices;*/
