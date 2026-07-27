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

export async function getContacts(range = "All Time") {
  try {
    const user = await getSessionContext();
    let contacts = await db.contact.findMany({
      where: { 
        shopId: user.activeShopId,
        isDeleted: false
      },
      orderBy: { createdAt: 'desc' }
    });

    // Dynamic balance calculation removed as Ledger is now decoupled from Analytics transactions
    
    // Serialize Decimals and Dates for Client Components
    return contacts.map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phone || "No phone provided",
      balance: c.balance.toString(),
      // Add fake last transaction date for UI parity until we fetch real last transaction
      lastTransaction: c.createdAt.toISOString()
    }));
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return [];
  }
}

export async function createContact(data) {
  try {
    const user = await getSessionContext();
    await db.contact.create({
      data: {
        shopId: user.activeShopId,
        name: data.name,
        phone: data.phone,
        balance: data.balance ? parseFloat(data.balance) : 0,
        createdBy: user.id,
      }
    });
    revalidatePath("/ledger");
    return { success: true };
  } catch (error) {
    console.error("Failed to create contact:", error);
    return { success: false, error: "Failed to create contact" };
  }
}

export async function deleteContact(contactId) {
  try {
    const user = await getSessionContext();
    if (user.shopRole !== "OWNER") {
      throw new Error("Only owners can delete a party.");
    }

    await db.contact.update({
      where: { id: contactId, shopId: user.activeShopId },
      data: { isDeleted: true }
    });

    revalidatePath("/ledger");
    revalidatePath("/analytics");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return { success: false, error: error.message || String(error) };
  }
}

export async function getContactTransactions(contactId) {
  try {
    const user = await getSessionContext();
    const transactions = await db.transaction.findMany({
      where: {
        shopId: user.activeShopId,
        contactId,
        isDeleted: false,
        status: "APPROVED" // Usually ledger only shows approved transactions
      },
      orderBy: { createdAt: 'desc' }
    });

    return transactions.map(tx => {
      const dateObj = tx.createdAt;
      
      // Basic formatting to match what the UI expects (e.g., "18 Jul 2026")
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = dateObj.toLocaleString('en-GB', { month: 'short' });
      const year = dateObj.getFullYear();
      
      // For time: "10:30 AM"
      let hour = dateObj.getHours();
      const minute = dateObj.getMinutes().toString().padStart(2, '0');
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12; // the hour '0' should be '12'
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;

      return {
        id: tx.id,
        date: `${day} ${month} ${year}`,
        time: timeStr,
        type: tx.type,
        amount: Number(tx.amount),
        note: tx.note || ""
      };
    });
  } catch (error) {
    console.error("Failed to fetch contact transactions:", error);
    return [];
  }
}

export async function adjustContactBalance(contactId, amount, type) {
  try {
    const user = await getSessionContext();
    const amountVal = parseFloat(amount) || 0;
    
    // type: "GIVE" means you gave them money (they owe you more -> +amount)
    // type: "COLLECT" means they gave you money (they owe you less -> -amount)
    const adjustment = type === "GIVE" ? amountVal : -amountVal;

    await db.contact.update({
      where: { id: contactId, shopId: user.activeShopId },
      data: { balance: { increment: adjustment } }
    });

    revalidatePath("/ledger");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to adjust contact balance:", error);
    return { success: false, error: error.message || String(error) };
  }
}
