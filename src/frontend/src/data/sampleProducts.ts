import { Category } from "../backend";
import type { Product } from "../types";

let idCounter = BigInt(1000);
function nextId(): bigint {
  return idCounter++;
}

const NOW = BigInt(Date.now()) * BigInt(1_000_000);

export const SAMPLE_PRODUCTS: Product[] = [
  // ── Shirts ──────────────────────────────────────────────
  {
    id: nextId(),
    name: "Royal Oxford Shirt",
    description:
      "Crafted from premium 100% cotton Oxford fabric, this shirt features a tailored fit and a classic spread collar. Perfect for formal occasions or elevated casual wear.",
    price: BigInt(179900), // ₹1,799
    category: Category.shirt,
    color: "Navy Blue",
    sizes: ["S", "M", "L", "XL", "XXL"],
    imageUrl: "https://placehold.co/400x400/0a1628/C9A84C?text=Royal+Oxford",
    inStock: true,
    createdAt: NOW,
  },
  {
    id: nextId(),
    name: "Premium Linen Shirt",
    description:
      "Lightweight and breathable linen fabric ideal for Indian summers. Features mother-of-pearl buttons and subtle texture that exudes understated luxury.",
    price: BigInt(149900), // ₹1,499
    category: Category.shirt,
    color: "Off White",
    sizes: ["S", "M", "L", "XL"],
    imageUrl: "https://placehold.co/400x400/1a1a14/C9A84C?text=Premium+Linen",
    inStock: true,
    createdAt: NOW,
  },
  {
    id: nextId(),
    name: "Slim Fit Formal Shirt",
    description:
      "A sharp silhouette for the modern professional. Non-iron wrinkle-resistant fabric keeps you looking polished through the longest meetings.",
    price: BigInt(129900), // ₹1,299
    category: Category.shirt,
    color: "Charcoal",
    sizes: ["M", "L", "XL", "XXL"],
    imageUrl: "https://placehold.co/400x400/1a1a1a/C9A84C?text=Slim+Formal",
    inStock: true,
    createdAt: NOW,
  },

  // ── T-Shirts ─────────────────────────────────────────────
  {
    id: nextId(),
    name: "Classic Crew Neck Tee",
    description:
      "The essential everyday tee, cut from 200GSM combed cotton for softness and structure. Ribbed collar that holds its shape after wash.",
    price: BigInt(79900), // ₹799
    category: Category.tshirt,
    color: "Jet Black",
    sizes: ["S", "M", "L", "XL", "XXL"],
    imageUrl: "https://placehold.co/400x400/0a0a0a/C9A84C?text=Classic+Crew",
    inStock: true,
    createdAt: NOW,
  },
  {
    id: nextId(),
    name: "Graphic Heritage Tee",
    description:
      "Inspired by India's royal textile heritage — bold emblem print on premium ivory cotton. Relaxed fit for maximum comfort.",
    price: BigInt(99900), // ₹999
    category: Category.tshirt,
    color: "Ivory",
    sizes: ["S", "M", "L", "XL"],
    imageUrl: "https://placehold.co/400x400/1a1a12/C9A84C?text=Heritage+Tee",
    inStock: true,
    createdAt: NOW,
  },
  {
    id: nextId(),
    name: "Essential V-Neck Tee",
    description:
      "Versatile V-neck silhouette that pairs with everything. Deep maroon adds a rich, royal dimension to your casual wardrobe.",
    price: BigInt(69900), // ₹699
    category: Category.tshirt,
    color: "Deep Maroon",
    sizes: ["S", "M", "L", "XL", "XXL"],
    imageUrl: "https://placehold.co/400x400/1a0a0a/C9A84C?text=V-Neck+Tee",
    inStock: true,
    createdAt: NOW,
  },

  // ── Hoodies ──────────────────────────────────────────────
  {
    id: nextId(),
    name: "Premium Pullover Hoodie",
    description:
      "370GSM French terry construction for exceptional warmth and drape. Kangaroo pocket and adjustable drawstring for a relaxed, elevated look.",
    price: BigInt(249900), // ₹2,499
    category: Category.hoodie,
    color: "Charcoal Grey",
    sizes: ["S", "M", "L", "XL", "XXL"],
    imageUrl: "https://placehold.co/400x400/181818/C9A84C?text=Pullover+Hoodie",
    inStock: true,
    createdAt: NOW,
  },
  {
    id: nextId(),
    name: "Zip-Up Fleece Hoodie",
    description:
      "Full-zip design with a luxurious fleece lining. Metal zipper pull with Velmora branding — effortless style meets winter warmth.",
    price: BigInt(279900), // ₹2,799
    category: Category.hoodie,
    color: "Midnight Black",
    sizes: ["M", "L", "XL", "XXL"],
    imageUrl: "https://placehold.co/400x400/080808/C9A84C?text=Zip+Hoodie",
    inStock: true,
    createdAt: NOW,
  },
  {
    id: nextId(),
    name: "Relaxed Fit Hoodie",
    description:
      "Oversized silhouette for the contemporary man. Earth-toned forest green with a subtle tonal logo embroidery at the chest.",
    price: BigInt(199900), // ₹1,999
    category: Category.hoodie,
    color: "Forest Green",
    sizes: ["S", "M", "L", "XL"],
    imageUrl: "https://placehold.co/400x400/0a140a/C9A84C?text=Relaxed+Hoodie",
    inStock: true,
    createdAt: NOW,
  },
];
