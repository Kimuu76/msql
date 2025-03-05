/** @format */
//import React from "react";
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import axios from "axios";

const Header = () => {
	const navigate = useNavigate();
	const [companyName, setCompanyName] = useState("POS Management System");

	// ✅ Fetch company name from database
	useEffect(() => {
		const fetchCompanyName = async () => {
			try {
				const response = await axios.get("http://localhost:5000/company");
				if (response.data?.name) {
					setCompanyName(response.data.name);
				}
			} catch (error) {
				console.error("Error fetching company name:", error);
			}
		};
		fetchCompanyName();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("isAuthenticated"); // ✅ Remove authentication token
		navigate("/login"); // ✅ Redirect to login
		window.location.reload(); // ✅ Ensure full refresh to clear all states
	};

	return (
		<AppBar
			position='sticky' // ✅ Make header sticky when scrolling
			sx={{
				background: "linear-gradient(135deg, rgb(16, 56, 96), #1565c0)",
				boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
				padding: "0 20px",
			}}
		>
			<Toolbar>
				{/* System Title (Left Side) 
				<Typography
					variant='h5'
					fontWeight='bold'
					sx={{ flexGrow: 1 }}
					textAlign='center'
				>
					🛒 POS Management System
				</Typography>*/}
				{/* Title: Fetch from Database */}
				<Typography
					variant='h5'
					fontWeight='bold'
					sx={{ flexGrow: 1, textAlign: "center" }}
				>
					{companyName}
				</Typography>

				{/* Logout Button (Right Side) */}
				<Button
					color='inherit'
					onClick={handleLogout}
					startIcon={<ExitToAppIcon />} // ✅ Add Logout Icon
					sx={{
						textTransform: "none", // ✅ Keep button text normal
						fontSize: "16px",
						backgroundColor: "rgba(255, 255, 255, 0.2)", // ✅ Slight background for contrast
						padding: "5px 15px",
						borderRadius: "5px",
						"&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
					}}
				>
					Logout
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default Header;

/** @format 
import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Header = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("isAuthenticated"); // ✅ Remove authentication token

		navigate("/login"); // ✅ Redirect to login
		window.location.reload(); // ✅ Ensure full refresh to clear all states
	};

	return (
		<AppBar
			position='static'
			sx={{
				background: "linear-gradient(135deg,rgb(16, 56, 96), #1565c0)",
				boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
				//zIndex: 1300, // Ensure it stays above the sidebar
			}}
		>
			<Toolbar>
				<Box flexGrow={1} textAlign='center'>
					<Box sx={{ paddingTop: "0.5px", display: "flex" }}></Box>

					<Typography variant='h4' fontWeight='bold' sx={{ flexGrow: 1 }}>
						🛒 POS Management System
					</Typography>
					{/* Logout Button (Right Side) 
					<Button
						color='inherit'
						onClick={handleLogout}
						startIcon={<ExitToAppIcon />} // ✅ Add Icon
						sx={{
							textTransform: "none", // ✅ Keep button text normal
							fontSize: "16px",
							backgroundColor: "rgba(255, 255, 255, 0.2)", // ✅ Slight background for contrast
							padding: "5px 15px",
							borderRadius: "5px",
							"&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
						}}
					>
						Logout
					</Button>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;*/
