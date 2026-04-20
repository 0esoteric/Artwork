/**
 * Script to add products to the database
 * Usage: npx tsx scripts/add-product.ts
 * 
 * This script can be used to bulk add products or individual products
 * You can modify the products array below to add your own products
 */

import mysql from "mysql2/promise"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "3306"),
}

interface ProductInput {
  name: string
  slug: string
  description: string
  shortDescription: string
  categorySlug: string
  price: number
  salePrice?: number
  sku: string
  stock: number
  artistName?: string
  dimensions?: string
  medium?: string
  weight?: number
  images: { url: string; alt?: string }[]
}

const sampleProducts: ProductInput[] = [
  {
    name: "Madhubani Peacock Garden",
    slug: "madhubani-peacock-garden",
    description: "A stunning Madhubani painting featuring peacocks in a lush garden setting. This traditional art form from Bihar showcases intricate patterns and vibrant colors that have been passed down through generations. Each brushstroke tells a story of nature's beauty and the cultural heritage of India.",
    shortDescription: "Traditional Madhubani painting with peacock motifs",
    categorySlug: "madhubani-art",
    price: 15000,
    salePrice: 12500,
    sku: "MAD-001",
    stock: 5,
    artistName: "Priya Devi",
    dimensions: "24 x 36 inches",
    medium: "Natural dyes on handmade paper",
    images: [
      { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=800&fit=crop", alt: "Madhubani Peacock Garden" }
    ]
  },
  {
    name: "Warli Village Life",
    slug: "warli-village-life",
    description: "An authentic Warli painting depicting the daily life of a tribal village. The simple yet expressive figures showcase agricultural activities, celebrations, and community gatherings. This monochromatic masterpiece uses traditional white on red ochre background.",
    shortDescription: "Warli art showing traditional village scenes",
    categorySlug: "warli-art",
    price: 8500,
    sku: "WAR-001",
    stock: 8,
    artistName: "Rajesh Warli",
    dimensions: "18 x 24 inches",
    medium: "Rice paste on mud base",
    images: [
      { url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=800&fit=crop", alt: "Warli Village Life" }
    ]
  },
  {
    name: "Tanjore Dancing Krishna",
    slug: "tanjore-dancing-krishna",
    description: "An exquisite Tanjore painting of Lord Krishna in his dancing pose. This South Indian art form features rich gold foil work, semi-precious stones, and vibrant colors. The painting is crafted using traditional techniques that have been practiced for over 400 years.",
    shortDescription: "Gold-embellished Tanjore painting of Krishna",
    categorySlug: "tanjore-art",
    price: 45000,
    salePrice: 38000,
    sku: "TAN-001",
    stock: 3,
    artistName: "Lakshmi Narayanan",
    dimensions: "20 x 24 inches",
    medium: "Gold foil and gemstones on wood panel",
    weight: 2.5,
    images: [
      { url: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&h=800&fit=crop", alt: "Tanjore Dancing Krishna" }
    ]
  },
  {
    name: "Pattachitra Jagannath Story",
    slug: "pattachitra-jagannath-story",
    description: "A beautiful Pattachitra scroll painting narrating the story of Lord Jagannath. This ancient art from Odisha features intricate details, mythological scenes, and traditional iconography. Created using natural colors and traditional techniques.",
    shortDescription: "Mythological Pattachitra scroll painting",
    categorySlug: "pattachitra",
    price: 22000,
    sku: "PAT-001",
    stock: 4,
    artistName: "Biswaranjan Das",
    dimensions: "12 x 48 inches (scroll)",
    medium: "Natural pigments on treated cloth",
    images: [
      { url: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&h=800&fit=crop", alt: "Pattachitra Jagannath Story" }
    ]
  },
  {
    name: "Kalamkari Tree of Life",
    slug: "kalamkari-tree-of-life",
    description: "A magnificent Kalamkari painting featuring the Tree of Life, a symbol of prosperity and growth. This hand-painted textile art from Andhra Pradesh uses natural dyes and showcases the mastery of the kalamkar (pen artist).",
    shortDescription: "Hand-painted Kalamkari textile art",
    categorySlug: "kalamkari",
    price: 12000,
    salePrice: 9500,
    sku: "KAL-001",
    stock: 6,
    artistName: "Ramesh Kumar",
    dimensions: "36 x 48 inches",
    medium: "Natural dyes on cotton fabric",
    images: [
      { url: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&h=800&fit=crop", alt: "Kalamkari Tree of Life" }
    ]
  },
]

async function addProducts() {
  const connection = await mysql.createConnection(dbConfig)
  console.log("Connected to database")

  try {
    for (const product of sampleProducts) {
      // Get category ID
      const [categories] = await connection.execute(
        "SELECT id FROM categories WHERE slug = ?",
        [product.categorySlug]
      ) as any[]

      if (!categories.length) {
        console.log(`Category not found: ${product.categorySlug}, skipping product: ${product.name}`)
        continue
      }

      const categoryId = categories[0].id

      // Get or create artist
      let artistId = null
      if (product.artistName) {
        const [artists] = await connection.execute(
          "SELECT id FROM artists WHERE name = ?",
          [product.artistName]
        ) as any[]

        if (artists.length) {
          artistId = artists[0].id
        } else {
          const [result] = await connection.execute(
            "INSERT INTO artists (name, bio, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
            [product.artistName, `Skilled artisan specializing in ${product.categorySlug.replace("-", " ")}`]
          ) as any
          artistId = result.insertId
          console.log(`Created artist: ${product.artistName}`)
        }
      }

      // Check if product already exists
      const [existing] = await connection.execute(
        "SELECT id FROM products WHERE slug = ?",
        [product.slug]
      ) as any[]

      if (existing.length) {
        console.log(`Product already exists: ${product.name}`)
        continue
      }

      // Insert product
      const [result] = await connection.execute(
        `INSERT INTO products 
         (name, slug, description, short_description, category_id, price, sale_price, sku, stock, artist_id, dimensions, medium, weight, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
        [
          product.name,
          product.slug,
          product.description,
          product.shortDescription,
          categoryId,
          product.price,
          product.salePrice || null,
          product.sku,
          product.stock,
          artistId,
          product.dimensions || null,
          product.medium || null,
          product.weight || null,
        ]
      ) as any

      const productId = result.insertId
      console.log(`Added product: ${product.name} (ID: ${productId})`)

      // Add product images
      for (let i = 0; i < product.images.length; i++) {
        await connection.execute(
          `INSERT INTO product_images (product_id, image_url, alt_text, display_order, created_at)
           VALUES (?, ?, ?, ?, NOW())`,
          [productId, product.images[i].url, product.images[i].alt || product.name, i]
        )
      }
    }

    console.log("All products added successfully!")
  } catch (error) {
    console.error("Error adding products:", error)
  } finally {
    await connection.end()
  }
}

addProducts()
