/** @format */

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
	Container,
	TextField,
	Button,
	Typography,
	Box,
	Alert,
} from "@mui/material";

const Setup = () => {
	const [name, setname] = useState("");
	const [secretKey, setSecretKey] = useState("");
	const [message, setMessage] = useState(""); // Success message
	const navigate = useNavigate();

	const handleSetup = async () => {
		if (!name || !secretKey) {
			setMessage("⚠️ Please fill in all fields.");
			return;
		}

		try {
			const response = await axios.post("http://localhost:5000/setup", {
				name,
				secretKey,
			});

			console.log("Setup Response:", response.data); // ✅ Debugging

			// Show success message and navigate to Login after a delay
			setMessage("✅ Company set up successfully! Please login.");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error("Setup failed:", error);
			setMessage("❌ Failed to set up company. Try again.");
		}
	};

	return (
		<Container maxWidth='sm'>
			<Box textAlign='center' mt={5} p={4} boxShadow={3} borderRadius={3}>
				<Typography variant='h4' gutterBottom>
					🏢 Company Setup
				</Typography>

				{message && (
					<Alert severity={message.includes("✅") ? "success" : "error"}>
						{message}
					</Alert>
				)}

				<TextField
					label='Company Name'
					variant='outlined'
					fullWidth
					margin='normal'
					value={name}
					onChange={(e) => setname(e.target.value)}
				/>
				<TextField
					label='Secret Key (Password)'
					variant='outlined'
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
					onClick={handleSetup}
					sx={{ mt: 2 }}
				>
					🚀 Set Up Company
				</Button>
			</Box>
		</Container>
	);
};

export default Setup;
