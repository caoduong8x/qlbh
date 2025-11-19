import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded: ", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT error:", err.name);

    // Trả về 401 thay vì 403
    return res.status(401).json({
      message:
        err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
    });
  }
};

export default verifyToken;
