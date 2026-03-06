import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

const sampleDahlias = [
  {
    name: "Café au Lait",
    slug: "cafe-au-lait",
    description: "A stunning dinnerplate dahlia with creamy, blush-toned petals.",
    detailedDescription: "Café au Lait is one of the most sought-after dahlias for weddings and arrangements.",
    price: 12.0,
    images: JSON.stringify(["https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800"]),
    category: "Dinnerplate",
    color: "Cream/Blush",
    size: "Giant",
    availableForShipping: true,
    availableForPickup: true,
    inStock: true,
  },
  {
    name: "Bishop of Llandaff",
    slug: "bishop-of-llandaff",
    description: "Vibrant red blooms with dark foliage create a striking contrast.",
    detailedDescription: "The Bishop of Llandaff is a beloved heirloom dahlia.",
    price: 10.0,
    images: JSON.stringify(["https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800"]),
    category: "Decorative",
    color: "Red",
    size: "Medium",
    availableForShipping: true,
    availableForPickup: true,
    inStock: true,
  },
  {
    name: "Pompon Mix",
    slug: "pompon-mix",
    description: "Cheerful, ball-shaped blooms in a rainbow of colors.",
    detailedDescription: "Our Pompon Mix features perfectly spherical, miniature blooms.",
    price: 8.0,
    images: JSON.stringify(["https://images.unsplash.com/photo-1578645510387-c3e6b247d0a5?w=800"]),
    category: "Pompon",
    color: "Mixed",
    size: "Small",
    availableForShipping: true,
    availableForPickup: true,
    inStock: true,
  },
];

async function main() {
  console.log("Seeding database...");
  for (const dahlia of sampleDahlias) {
    await prisma.dahlia.upsert({
      where: { slug: dahlia.slug },
      update: dahlia,
      create: dahlia,
    });
  }
  console.log(`Seeded ${sampleDahlias.length} dahlias.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
