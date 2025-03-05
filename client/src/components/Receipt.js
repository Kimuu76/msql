/** @format */
import React, { useEffect, useRef, useState } from "react";
import { Button, Typography, Box, Divider } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import axios from "axios";

const Receipt = ({ receipt, autoPrint }) => {
	const receiptRef = useRef(); // Reference for printing
	const [companyName, setCompanyName] = useState("Store Name"); // Default store name

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

	// ✅ Print function
	const handlePrint = useReactToPrint({
		content: () => receiptRef.current,
		documentTitle: `Receipt_${receipt?.receiptNumber || "NoNumber"}`,
	});

	// ✅ Auto-trigger print when receipt is set
	useEffect(() => {
		if (autoPrint && receipt && receipt.items?.length > 0) {
			setTimeout(() => {
				handlePrint();
			}, 500); // Small delay to ensure UI updates
		}
	}, [receipt, autoPrint]);

	// ✅ Check if receipt exists
	if (!receipt || !receipt.items) {
		return <Typography>No receipt data available.</Typography>;
	}

	return (
		<Box sx={{ textAlign: "center", marginTop: 3 }}>
			<Box
				ref={receiptRef}
				sx={{
					width: "350px",
					padding: 2,
					margin: "auto",
					backgroundColor: "#fff",
					border: "1px solid #ccc",
					boxShadow: 3,
					borderRadius: 2,
				}}
			>
				{/*<Typography variant='h6' fontWeight='bold'>
					🛒 STORE NAME
				</Typography>*/}
				{/* ✅ Display Dynamic Store Name from Database */}
				<Typography variant='h6' fontWeight='bold'>
					🛒 {companyName}
				</Typography>
				{/*<Typography variant='body2'>123 Main Street, City, Country</Typography>
				<Typography variant='body2'>📞 +25479956754</Typography>
				<Divider sx={{ my: 1 }} />*/}
				<Typography variant='subtitle2'>
					Receipt No: <strong>{receipt.receiptNumber}</strong>
				</Typography>
				<Typography variant='subtitle2'>Date: {receipt.date}</Typography>
				<Divider sx={{ my: 1 }} />

				{/* Table Header */}
				<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
					<Typography variant='subtitle2' fontWeight='bold'>
						Item
					</Typography>
					<Typography variant='subtitle2' fontWeight='bold'>
						Qty
					</Typography>
					<Typography variant='subtitle2' fontWeight='bold'>
						Price
					</Typography>
					<Typography variant='subtitle2' fontWeight='bold'>
						Total
					</Typography>
				</Box>

				{/* Items List */}
				{receipt.items.map((item, index) => (
					<Box
						key={index}
						sx={{ display: "flex", justifyContent: "space-between", my: 0.5 }}
					>
						<Typography variant='body2'>{item.productName}</Typography>
						<Typography variant='body2'>{item.quantity}</Typography>
						<Typography variant='body2'>
							KES {item.pricePerUnit?.toFixed(2)}
						</Typography>
						<Typography variant='body2'>
							KES {item.total?.toFixed(2)}
						</Typography>
					</Box>
				))}

				<Divider sx={{ my: 1 }} />
				{/* Total Amount */}
				<Typography variant='subtitle1' fontWeight='bold'>
					Total: KES {receipt.totalAmount?.toFixed(2)}
				</Typography>

				<Typography variant='body2' sx={{ mt: 1 }}>
					Thank you for shopping with us! 🎉
				</Typography>
			</Box>

			{/* ✅ Print Button (Optional if not auto-printing) */}
			<Button
				variant='contained'
				color='primary'
				onClick={handlePrint}
				sx={{ mt: 2 }}
			>
				Print Receipt 🖨️
			</Button>
		</Box>
	);
};

export default Receipt;
