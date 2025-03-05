/** @format */

import { Link, useLocation } from "react-router-dom";
import {
	Drawer,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Typography,
	Box,
} from "@mui/material";
import {
	Dashboard,
	ShoppingCart,
	Inventory,
	People,
	AttachMoney,
	AssignmentReturn,
	Assessment,
	Store,
	MonetizationOn,
	ArrowBack,
	Profile,
} from "@mui/icons-material";

const Sidebar = () => {
	const location = useLocation(); // Get current path

	const menuItems = [
		{ text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
		{ text: "Products", icon: <Inventory />, path: "/products" },
		{ text: "Sales", icon: <ShoppingCart />, path: "/sales" },
		{ text: "Purchases", icon: <Store />, path: "/purchases" },
		{ text: "Suppliers", icon: <People />, path: "/suppliers" },
		{ text: "Stock & Prices", icon: <MonetizationOn />, path: "/stockprices" },
		{
			text: "Purchase Returns",
			icon: <AssignmentReturn />,
			path: "/purchasereturns",
		},
		{ text: "Sales Returns", icon: <ArrowBack />, path: "/salesreturns" },
		{ text: "Reports", icon: <Assessment />, path: "/reports" },
	];

	return (
		<Drawer
			variant='permanent'
			sx={{
				width: 250,
				"& .MuiDrawer-paper": {
					width: 250,
					background: "linear-gradient(135deg,rgb(13, 28, 77), #1565c0)",
					color: "#fff",
					borderRight: "1px solid #ddd",
					paddingTop: 2,
				},
			}}
		>
			{/* Sidebar Title */}
			<Box sx={{ textAlign: "center", py: 2 }}>
				<Typography variant='h6' fontWeight='bold'>
					System Admin
				</Typography>
			</Box>

			<List>
				{menuItems.map((item, index) => (
					<ListItem
						button
						component={Link}
						to={item.path}
						key={index}
						sx={{
							color: "#fff",
							backgroundColor:
								location.pathname === item.path ? "#0d47a1" : "transparent",
							"&:hover": { backgroundColor: "#1565c0" },
							borderRadius: "5px",
							margin: "5px",
						}}
					>
						<ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
						<ListItemText primary={item.text} />
					</ListItem>
				))}
			</List>
		</Drawer>
	);
};

export default Sidebar;

/** @format 

import { Link } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";

const Sidebar = () => {
	return (
		<Drawer variant='permanent'>
			<List>
				<ListItem button component={Link} to='/dashboard'>
					<ListItemText primary='Dashboard' />
				</ListItem>
				<ListItem button component={Link} to='/products'>
					<ListItemText primary='Products' />
				</ListItem>
				<ListItem button component={Link} to='/sales'>
					<ListItemText primary='Sales' />
				</ListItem>
				<ListItem button component={Link} to='/purchases'>
					<ListItemText primary='Purchases' />
				</ListItem>
				<ListItem button component={Link} to='/suppliers'>
					<ListItemText primary='Suppliers' />
				</ListItem>
				<ListItem button component={Link} to='/stockprices'>
					<ListItemText primary='Stock & Prices' />
				</ListItem>
				<ListItem button component={Link} to='/purchasereturns'>
					<ListItemText primary='Purchase Returns' />
				</ListItem>
				<ListItem button component={Link} to='/salesreturns'>
					<ListItemText primary='Sales Returns' />
				</ListItem>
				<ListItem button component={Link} to='/reports'>
					<ListItemText primary='Reports' />
				</ListItem>
			</List>
		</Drawer>
	);
};

export default Sidebar;*/
