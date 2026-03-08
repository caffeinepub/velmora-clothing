import type { Category } from "../backend";

export type { Category };

export interface Product {
  id: bigint;
  inStock: boolean;
  name: string;
  createdAt: bigint;
  color: string;
  description: string;
  sizes: Array<string>;
  imageUrl: string;
  category: Category;
  price: bigint; // in paise (1 INR = 100 paise)
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

/** Format bigint paise to INR display string e.g. ₹1,299 */
export function formatINR(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/** Convert INR rupee number to paise bigint */
export function rupeesToPaise(rupees: number): bigint {
  return BigInt(Math.round(rupees * 100));
}

/** Convert paise bigint to INR number */
export function paiseToRupees(paise: bigint): number {
  return Number(paise) / 100;
}
