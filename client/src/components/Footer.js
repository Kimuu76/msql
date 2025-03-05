/** @format */

import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
	return (
		<Box
			component='footer'
			sx={{
				position: "fixed",
				bottom: 0,
				left: 0,
				width: "100%",
				backgroundColor: "#1976d2",
				color: "white",
				textAlign: "center",
				padding: "10px 0",
				boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
			}}
		>
			<Container>
				<Typography variant='body2'>
					copyright @ {new Date().getFullYear()} System | Developed by kimuu76 |
					+254712992577
				</Typography>
			</Container>
		</Box>
	);
};

export default Footer;
