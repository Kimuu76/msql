/** @format */

const jwt = require("jsonwebtoken");
const SECRET = "your_jwt_secret";

const authenticateToken = (req, res, next) => {
	const token = req.header("Authorization");

	if (!token) {
		return res
			.status(401)
			.json({ message: "Access denied. No token provided." });
	}

	try {
		const verified = jwt.verify(token.split(" ")[1], SECRET);
		req.user = verified;
		next();
	} catch (err) {
		res.status(403).json({ message: "Invalid token." });
	}
};

module.exports = authenticateToken;
