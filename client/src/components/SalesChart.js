/** @format */

import { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import axios from "axios";

const SalesChart = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		axios.get("http://localhost:5000/products").then((res) => {
			setData(
				res.data.map((product) => ({
					name: product.name,
					stock: product.stock,
				}))
			);
		});
	}, []);

	return (
		<ResponsiveContainer width='100%' height={300}>
			<BarChart data={data}>
				<XAxis dataKey='name' />
				<YAxis />
				<Tooltip />
				<Bar dataKey='stock' fill='#8884d8' />
			</BarChart>
		</ResponsiveContainer>
	);
};

export default SalesChart;
