import express from "express";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// get all products (protected)
router.get("/", auth, async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// create product (protected)
router.post("/", auth, async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
    const p = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock || 0),
      },
    });
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

export default router;
