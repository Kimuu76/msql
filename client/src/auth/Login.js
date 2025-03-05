/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate
import axios from "axios";
import { TextField, Button, Typography, Container, Paper } from "@mui/material";

const Login = () => {
	const [secretKey, setSecretKey] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate(); // ✅ Use React Router navigation

	const handleLogin = async () => {
		try {
			const response = await axios.post("http://localhost:5000/login", {
				secretKey,
			});

			if (response.status === 200) {
				localStorage.setItem("isAuthenticated", "true"); // ✅ Store authentication
				navigate("/dashboard", { replace: true }); // ✅ Navigate to dashboard
			}
		} catch (error) {
			setError("❌ Invalid Secret Key! Please try again.");
		}
	};

	return (
		<Container maxWidth='sm'>
			<Paper elevation={3} style={{ padding: "20px", marginTop: "50px" }}>
				<Typography variant='h4' align='center'>
					🔐 Login
				</Typography>

				{error && <Typography color='error'>{error}</Typography>}

				<TextField
					label='Enter Secret Key'
					type='password'
					fullWidth
					margin='normal'
					value={secretKey}
					onChange={(e) => setSecretKey(e.target.value)}
				/>

				<Button
					variant='contained'
					color='primary'
					fullWidth
					onClick={handleLogin}
				>
					Login
				</Button>
			</Paper>
		</Container>
	);
};

export default Login;

/** @format 

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";

const Login = () => {
	const [secretKey, setSecretKey] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async () => {
		if (!secretKey) {
			alert("⚠ Please enter the secret key!");
			return;
		}

		try {
			const response = await axios.post("http://localhost:5000/login", {
				secretKey,
			});

			if (response.status === 200) {
				localStorage.setItem("isAuthenticated", "true"); // ✅ Store authentication
				navigate("/dashboard"); // ✅ Navigate to dashboard
			}
		} catch (error) {
			setError("❌ Invalid Secret Key! Please try again.");
		}
	};

	return (
		<Container maxWidth='sm'>
			<Box sx={{ textAlign: "center", mt: 5 }}>
				<Typography variant='h4'>🔐 System Login</Typography>

				{error && <Typography color='error'>{error}</Typography>}
				<TextField
					label='Secret Key'
					type='password'
					fullWidth
					margin='normal'
					value={secretKey}
					onChange={(e) => setSecretKey(e.target.value)}
				/>
				<Button
					variant='contained'
					color='primary'
					fullWidth
					onClick={handleLogin}
					sx={{ mt: 2 }}
				>
					Login
				</Button>
			</Box>
		</Container>
	);
};

export default Login;*/

/** @format 

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	Paper,
} from "@mui/material";

const Login = () => {
	const navigate = useNavigate();
	const [inputKey, setInputKey] = useState("");

	const handleLogin = () => {
		const savedKey = localStorage.getItem("secretKey");

		if (inputKey === savedKey) {
			localStorage.setItem("isAuthenticated", "true"); // ✅ Mark as logged in
			navigate("/dashboard"); // Redirect to Dashboard
		} else {
			alert("❌ Incorrect Secret Key! Try Again.");
		}
	};

	return (
		<Container maxWidth='sm'>
			<Paper
				elevation={3}
				sx={{ padding: 3, textAlign: "center", marginTop: 5 }}
			>
				<Typography variant='h5' gutterBottom>
					🔑 Enter Secret Key
				</Typography>

				<TextField
					fullWidth
					label='Secret Key'
					type='password'
					value={inputKey}
					onChange={(e) => setInputKey(e.target.value)}
					margin='normal'
				/>

				<Button
					variant='contained'
					color='primary'
					onClick={handleLogin}
					sx={{ marginTop: 2 }}
				>
					Login
				</Button>
			</Paper>
		</Container>
	);
};

export default Login;*/
