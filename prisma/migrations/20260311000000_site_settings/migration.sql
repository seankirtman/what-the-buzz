-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY DEFAULT 1,
    "heroCoverUrl" TEXT,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "SiteSettings" ("id", "heroCoverUrl", "updatedAt") VALUES (1, NULL, CURRENT_TIMESTAMP);
