// src/controllers/customerController.js
import prisma from "../prismaClient.js";

// 🧾 Lấy danh sách khách hàng
export const getCustomers = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", getAll = false } = req.query;
    if (getAll) {
      const customers = await prisma.customer.findMany();
      res.json({ data: customers });
    } else {
      page = parseInt(page);
      limit = parseInt(limit);
      const skip = (page - 1) * limit;

      // Điều kiện tìm kiếm
      const where = search
        ? {
            OR: [
              { name: { contains: search } },
              { phone: { contains: search } },
            ],
          }
        : {};

      // Đếm tổng
      const total = await prisma.customer.count({ where });
      const totalPages = Math.ceil(total / limit);

      const customers = await prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: "desc" },
      });
      res.json({ data: customers, total, totalPages, page, limit });
    }
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Lấy chi tiết 1 khách hàng
export const getCustomerById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer)
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ Tạo mới khách hàng
export const createCustomer = async (req, res) => {
  try {
    const { name, phone, address, email } = req.body;
    const customer = await prisma.customer.create({
      data: { name, phone, address, email },
    });
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✏️ Cập nhật khách hàng
export const updateCustomer = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, phone, address, email } = req.body;
    const customer = await prisma.customer.update({
      where: { id },
      data: { name, phone, address, email },
    });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Xóa khách hàng
export const deleteCustomer = async (req, res) => {
  try {
    const id = parseInt(req.params.idd);
    await prisma.customer.delete({ where: { id } });
    res.json({ message: "Đã xóa khách hàng" });
  } catch (err) {
    console.log("err: ", err.message);
    res.status(400).json({ error: err.message });
  }
};

// export const deleteCustomer = async (req, res) => {
//   try {
//     // Giả lập lỗi Prisma
//     const err = new Error("Record to delete does not exist.");
//     err.code = "P2025"; // Prisma error code cho "Record not found"
//     err.meta = { cause: "Customer with this ID does not exist." };
//     throw err;
//   } catch (err) {
//     console.log("err:", err);
//     res
//       .status(400)
//       .json({ error: err.message, code: err.code, meta: err.meta });
//   }
// };
