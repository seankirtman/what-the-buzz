-- CreateTable
CREATE TABLE "Dahlia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "detailedDescription" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "images" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "availableForShipping" BOOLEAN NOT NULL DEFAULT true,
    "availableForPickup" BOOLEAN NOT NULL DEFAULT true,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Dahlia_slug_key" ON "Dahlia"("slug");
