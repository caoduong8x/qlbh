import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Đang seed dữ liệu mẫu...");

  // ========== 3. CUSTOMERS ==========
  await prisma.customer.createMany({
    data: [
      { name: "Trần Văn A", phone: "0987254332", address: "Quảng Nam" },
      { name: "Trần Văn B", phone: "0987354323", address: "Quảng Nam" },
      { name: "Trần Văn C", phone: "0987454324", address: "Quảng Nam" },
      { name: "Trần Văn D", phone: "0987554325", address: "Quảng Nam" },
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
