export interface Dahlia {
  id: number;
  name: string;
  slug: string;
  description: string;
  detailedDescription: string;
  price: number;
  images: string[];
  category: string;
  color: string;
  size: string;
  availableForShipping: boolean;
  availableForPickup: boolean;
  inStock: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
