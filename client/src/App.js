/** @format */

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Setup from "./auth/Setup";
import Login from "./auth/Login";
import Dashboard from "./components/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Purchases from "./pages/Purchases";
import PurchaseReturns from "./pages/PurchaseReturns";
import SalesReturns from "./pages/SalesReturns";
import Reports from "./components/Reports";
import Suppliers from "./pages/Suppliers";
import StockPrices from "./pages/StockPrices";

const App = () => {
	const [isSetup, setIsSetup] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// ✅ Check if the company is set up
	useEffect(() => {
		const checkSetup = async () => {
			try {
				const response = await axios.get("http://localhost:5000/company");
				if (response.data) {
					setIsSetup(true);
					//localStorage.setItem("isSetup", "true");
				}
			} catch (error) {
				setIsSetup(false);
				//localStorage.setItem("isSetup", "false");
			}
		};

		checkSetup();
		setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");

		// Auto Logout on Inactivity (3 minutes)
		let logoutTimer;
		const resetTimer = () => {
			clearTimeout(logoutTimer);
			logoutTimer = setTimeout(() => {
				localStorage.removeItem("isAuthenticated"); // Logout user
				window.location.href = "/login"; // Redirect to login
			}, 180000); // 3 minutes (180000ms)
		};

		// Detect user activity
		const activityEvents = ["mousemove", "keydown", "click"];
		activityEvents.forEach((event) =>
			document.addEventListener(event, resetTimer)
		);

		resetTimer(); // Start timer when page loads

		return () => {
			activityEvents.forEach((event) =>
				document.removeEventListener(event, resetTimer)
			);
			clearTimeout(logoutTimer);
		};
	}, []);

	return (
		<Router>
			{isAuthenticated && <Header />}
			<div style={{ display: "flex" }}>
				{isAuthenticated && <Sidebar />}
				<div
					style={{
						marginLeft: isAuthenticated ? "200px" : "0",
						padding: "20px",
						width: "100%",
					}}
				>
					<Routes>
						{/* ✅ Step 1: Redirect to Setup if not set up */}
						{!isSetup ? (
							<>
								<Route path='/setup' element={<Setup />} />
								<Route path='*' element={<Navigate to='/setup' />} />
							</>
						) : !isAuthenticated ? (
							<>
								{/* ✅ Step 2: Redirect to Login if not authenticated */}
								<Route path='/login' element={<Login />} />
								<Route path='*' element={<Navigate to='/login' />} />
							</>
						) : (
							<>
								{/* ✅ Step 3: Show Main App After Login */}
								<Route path='/dashboard' element={<Dashboard />} />
								<Route path='/products' element={<Products />} />
								<Route path='/sales' element={<Sales />} />
								<Route path='/stockprices' element={<StockPrices />} />
								<Route path='/purchases' element={<Purchases />} />
								<Route path='/suppliers' element={<Suppliers />} />
								<Route path='/purchasereturns' element={<PurchaseReturns />} />
								<Route path='/salesreturns' element={<SalesReturns />} />
								<Route path='/reports' element={<Reports />} />
								<Route path='*' element={<Navigate to='/dashboard' />} />
							</>
						)}
					</Routes>
				</div>
			</div>
			{isAuthenticated && <Footer />}
		</Router>
	);
};

export default App;

/** @format 

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Setup from "./auth/Setup";
import Login from "./auth/Login";
import Dashboard from "./components/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Purchases from "./pages/Purchases";
import PurchaseReturns from "./pages/PurchaseReturns";
import SalesReturns from "./pages/SalesReturns";
import Reports from "./components/Reports";
import Suppliers from "./pages/Suppliers";
import StockPrices from "./pages/StockPrices";

const App = () => {
	const [isSetup, setIsSetup] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkSetup = async () => {
			try {
				const response = await axios.get("http://localhost:5000/company");
				if (response.data) {
					setIsSetup(true);
					localStorage.setItem("isSetup", "true");
				}
			} catch (error) {
				setIsSetup(false);
				localStorage.setItem("isSetup", "false");
			}
		};

		checkSetup();
		setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
	}, []);

	return (
		<Router>
			<Routes>
				{/* Step 1: Redirect to Setup if not set up *
				{!isSetup ? (
					<Route path='*' element={<Setup />} />
				) : !isAuthenticated ? (
					// Step 2: Redirect to Login if not authenticated
					<Route path='*' element={<Navigate to='/login' />} />
				) : (
					<>
						{/* Step 3: Show Sidebar, Header, and Footer for authenticated users *
						{isAuthenticated && <Header />}
						<div style={{ display: "flex" }}>
							{isAuthenticated && <Sidebar />}
							<div
								style={{ marginLeft: "200px", padding: "20px", width: "100%" }}
							>
								<Routes>
									<Route path='/setup' element={<Setup />} />
									<Route path='/login' element={<Login />} />
									<Route path='/dashboard' element={<Dashboard />} />
									<Route path='/products' element={<Products />} />
									<Route path='/sales' element={<Sales />} />
									<Route path='/stockprices' element={<StockPrices />} />
									<Route path='/purchases' element={<Purchases />} />
									<Route path='/suppliers' element={<Suppliers />} />
									<Route
										path='/purchasereturns'
										element={<PurchaseReturns />}
									/>
									<Route path='/salesreturns' element={<SalesReturns />} />
									<Route path='/reports' element={<Reports />} />
									<Route path='*' element={<Navigate to='/dashboard' />} />
								</Routes>
							</div>
						</div>
						{isAuthenticated && <Footer />}
					</>
				)}
			</Routes>
		</Router>
	);
};

export default App;*/
