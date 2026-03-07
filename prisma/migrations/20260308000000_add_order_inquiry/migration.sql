-- CreateTable
CREATE TABLE "OrderInquiry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "deliveryMethod" TEXT NOT NULL,
    "pickupTime" TEXT,
    "phone" TEXT,
    "shippingAddress" TEXT,
    "message" TEXT,
    "cartItems" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
