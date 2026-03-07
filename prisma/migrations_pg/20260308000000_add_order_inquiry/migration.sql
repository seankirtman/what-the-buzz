-- CreateTable
CREATE TABLE "OrderInquiry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "deliveryMethod" TEXT NOT NULL,
    "pickupTime" TEXT,
    "phone" TEXT,
    "shippingAddress" TEXT,
    "message" TEXT,
    "cartItems" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderInquiry_pkey" PRIMARY KEY ("id")
);
