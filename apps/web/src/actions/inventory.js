"use server";

import { db } from "@hisab-kitab/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getSessionContext() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.user?.activeShopId) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function getProducts(filters = {}) {
  try {
    const user = await getSessionContext();
    
    const whereClause = {
      shopId: user.activeShopId,
      isDeleted: false
    };

    if (filters.name) {
      whereClause.name = { contains: filters.name, mode: 'insensitive' };
    }
    
    if (filters.category && filters.category !== "ALL") {
      whereClause.category = filters.category;
    }

    if (filters.expiryDate) {
      // Find products expiring exactly on the selected day
      const targetDate = new Date(filters.expiryDate);
      const nextDay = new Date(targetDate);
      nextDay.setDate(targetDate.getDate() + 1);
      
      whereClause.expiryDate = {
        gte: targetDate,
        lt: nextDay
      };
    }

    const products = await db.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    // Serialize Decimals for Client Components
    return products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      sku: p.sku,
      currentStock: p.currentStock.toString(),
      unit: p.unit,
      purchasePrice: p.purchasePrice.toString(),
      sellingPrice: p.sellingPrice.toString(),
      expiryDate: p.expiryDate ? p.expiryDate.toISOString() : null,
      // calculate status based on stock
      status: parseFloat(p.currentStock.toString()) === 0 ? "Out" : (parseFloat(p.currentStock.toString()) <= 10 ? "Low" : "Healthy")
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function createProduct(data) {
  try {
    const user = await getSessionContext();
    await db.product.create({
      data: {
        shopId: user.activeShopId,
        name: data.name,
        category: data.category,
        sku: data.sku,
        currentStock: parseFloat(data.currentStock) || 0,
        unit: data.unit,
        purchasePrice: parseFloat(data.purchasePrice) || 0,
        sellingPrice: parseFloat(data.sellingPrice) || 0,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        createdBy: user.id,
      }
    });
    revalidatePath("/inventory");
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
}
