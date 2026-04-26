-- Make text fields optional at the DB layer (empty string / default for new rows).
ALTER TABLE "Dahlia"
  ALTER COLUMN "description" SET DEFAULT '',
  ALTER COLUMN "detailedDescription" SET DEFAULT '',
  ALTER COLUMN "images" SET DEFAULT '[]',
  ALTER COLUMN "category" SET DEFAULT '',
  ALTER COLUMN "color" SET DEFAULT '',
  ALTER COLUMN "size" SET DEFAULT '';
