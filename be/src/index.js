import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import productRoutes from "./routes/products.js";
import customerRoutes from "./routes/customers.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// 👉 Thêm dòng này để parse `application/vnd.api+json`
app.use(
  bodyParser.json({ type: ["application/json", "application/vnd.api+json"] })
);

// Nếu bạn có dùng URL-encoded
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Sales Management API Running"));
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/customers", customerRoutes);

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Server running on port ${port}`));
