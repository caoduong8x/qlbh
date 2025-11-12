import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Đang seed dữ liệu mẫu...");

  // ========== 1. USERS ==========
  const users = [
    {
      email: "admin@example.com",
      name: "Quản trị viên",
      role: "admin",
      password: "abc123-=",
    },
  ];

  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role, password: hashed },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        password: hashed,
      },
    });
  }

  // ========== 2. SUPPLIERS ==========
  const suppliers = await prisma.supplier.createMany({
    data: [
      {
        name: "Công ty TNHH Nước giải khát Pepsi",
        phone: "0905123456",
        address: "Hà Nội",
      },
      {
        name: "Công ty Bánh kẹo Orion",
        phone: "0905789123",
        address: "TP.HCM",
      },
    ],
  });

  // ========== 3. CUSTOMERS ==========
  await prisma.customer.createMany({
    data: [
      { name: "Nguyễn Văn A", phone: "0987654321", address: "Quảng Nam" },
      { name: "Công ty TNHH ABC", phone: "0909998888", address: "Đà Nẵng" },
    ],
  });

  // ========== 4. PRODUCTS ==========
  await prisma.product.createMany({
    data: [
      { code: "SP001", name: "Pepsi lon 330ml", unit: "lon", price: 12000 },
      { code: "SP002", name: "Bánh Oreo", unit: "gói", price: 15000 },
      { code: "SP003", name: "Sting dâu", unit: "chai", price: 10000 },
    ],
  });

  // ========== 5. IMPORT RECEIPT ==========
  const supplier = await prisma.supplier.findFirst();
  const product1 = await prisma.product.findUnique({
    where: { code: "SP001" },
  });
  const product2 = await prisma.product.findUnique({
    where: { code: "SP002" },
  });

  const importReceipt = await prisma.importReceipt.create({
    data: {
      code: "PN001",
      supplierId: supplier?.id,
      totalAmount: 500000,
      items: {
        create: [
          {
            productId: product1!.id,
            quantity: 100,
            unitPrice: 5000,
            remainQuantity: 100,
          },
          {
            productId: product2!.id,
            quantity: 50,
            unitPrice: 8000,
            remainQuantity: 50,
          },
        ],
      },
    },
    include: { items: true },
  });

  // ========== 6. SALES ORDER ==========
  const customer = await prisma.customer.findFirst();

  const salesOrder = await prisma.salesOrder.create({
    data: {
      code: "HD001",
      customerId: customer?.id,
      totalAmount: 120000,
      totalCost: 80000,
      profit: 40000,
      items: {
        create: [
          {
            productId: product1!.id,
            quantity: 10,
            salePrice: 12000,
            costPrice: 8000,
          },
        ],
      },
    },
    include: { items: true },
  });

  // ========== 7. INVENTORY MOVEMENTS ==========
  await prisma.inventoryMovement.createMany({
    data: [
      {
        productId: product1!.id,
        type: "IMPORT",
        quantity: 100,
        refTable: "import_items",
        refId: importReceipt.items[0].id,
      },
      {
        productId: product1!.id,
        type: "SALE",
        quantity: -10,
        refTable: "sales_items",
        refId: salesOrder.items[0].id,
      },
    ],
  });

  console.log("✅ Seed dữ liệu mẫu thành công!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi seed dữ liệu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
