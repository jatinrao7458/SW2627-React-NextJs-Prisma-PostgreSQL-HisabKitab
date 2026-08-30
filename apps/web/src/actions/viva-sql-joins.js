"use server";

/**
 * SQL JOINs Demonstration — Viva Server Action
 * 
 * This file demonstrates REAL PostgreSQL SQL JOINs using Prisma's $queryRaw.
 * Instead of simulating JOINs in JavaScript, this executes actual SQL JOIN
 * queries against the PostgreSQL database and returns the results.
 * 
 * JOINs demonstrated:
 *   1. INNER JOIN  — Only matching rows from both tables
 *   2. LEFT JOIN   — All rows from left table + matching from right
 *   3. RIGHT JOIN  — All rows from right table + matching from left
 *   4. FULL OUTER JOIN — All rows from both tables, NULLs where no match
 * 
 * Tables used: "Contact" (left) and "Transaction" (right) joined on contactId.
 * 
 * Prisma's `include` clause also translates to SQL JOINs under the hood.
 * For example:
 *   db.transaction.findMany({ include: { contact: true } })
 * generates:
 *   SELECT ... FROM "Transaction" LEFT JOIN "Contact" ON "Transaction"."contactId" = "Contact"."id"
 */

import { db } from "@hisab-kitab/database";

/**
 * Demonstrates SQL JOINs by running raw PostgreSQL queries.
 * Does NOT require authentication — this is for viva demonstration only.
 * Returns structured results for each JOIN type.
 */
export async function demonstrateSqlJoinsFromDB() {
  try {
    // ─── 1. INNER JOIN ──────────────────────────────────────────────────
    // Returns only contacts that have at least one transaction.
    // SQL: SELECT c.name, t.amount, t.type FROM "Contact" c INNER JOIN "Transaction" t ON c.id = t."contactId"
    const innerJoinResults = await db.$queryRaw`
      SELECT 
        c."name" AS contact_name,
        t."amount",
        t."type",
        t."createdAt" AS transaction_date
      FROM "Contact" c
      INNER JOIN "Transaction" t ON c."id" = t."contactId"
      WHERE c."isDeleted" = false AND t."isDeleted" = false
      ORDER BY c."name", t."createdAt" DESC
      LIMIT 20
    `;

    // ─── 2. LEFT JOIN ───────────────────────────────────────────────────
    // Returns ALL contacts, even those with no transactions (NULL for transaction columns).
    // SQL: SELECT c.name, t.amount FROM "Contact" c LEFT JOIN "Transaction" t ON c.id = t."contactId"
    const leftJoinResults = await db.$queryRaw`
      SELECT 
        c."name" AS contact_name,
        t."amount",
        t."type",
        t."createdAt" AS transaction_date
      FROM "Contact" c
      LEFT JOIN "Transaction" t ON c."id" = t."contactId" AND t."isDeleted" = false
      WHERE c."isDeleted" = false
      ORDER BY c."name", t."createdAt" DESC
      LIMIT 20
    `;

    // ─── 3. RIGHT JOIN ──────────────────────────────────────────────────
    // Returns ALL transactions, even those whose contact may have been soft-deleted.
    // SQL: SELECT c.name, t.amount FROM "Contact" c RIGHT JOIN "Transaction" t ON c.id = t."contactId"
    const rightJoinResults = await db.$queryRaw`
      SELECT 
        c."name" AS contact_name,
        t."amount",
        t."type",
        t."createdAt" AS transaction_date
      FROM "Contact" c
      RIGHT JOIN "Transaction" t ON c."id" = t."contactId" AND c."isDeleted" = false
      WHERE t."isDeleted" = false
      ORDER BY t."createdAt" DESC
      LIMIT 20
    `;

    // ─── 4. FULL OUTER JOIN ─────────────────────────────────────────────
    // Returns ALL contacts and ALL transactions, with NULLs where there's no match.
    // SQL: SELECT c.name, t.amount FROM "Contact" c FULL OUTER JOIN "Transaction" t ON c.id = t."contactId"
    const fullOuterJoinResults = await db.$queryRaw`
      SELECT 
        c."name" AS contact_name,
        t."amount",
        t."type",
        t."createdAt" AS transaction_date
      FROM "Contact" c
      FULL OUTER JOIN "Transaction" t ON c."id" = t."contactId"
      WHERE (c."isDeleted" = false OR c."isDeleted" IS NULL)
        AND (t."isDeleted" = false OR t."isDeleted" IS NULL)
      ORDER BY c."name" NULLS LAST, t."createdAt" DESC NULLS LAST
      LIMIT 20
    `;

    // ─── 5. Prisma Include (ORM-level JOIN) ─────────────────────────────
    // Prisma's `include` translates to a LEFT JOIN under the hood.
    // This is how JOINs are used throughout the HisabKitab codebase.
    const prismaJoinResults = await db.contact.findMany({
      where: { isDeleted: false },
      include: {
        transactions: {
          where: { isDeleted: false },
          select: { amount: true, type: true, createdAt: true },
          take: 3,
          orderBy: { createdAt: "desc" },
        },
      },
      take: 10,
      orderBy: { name: "asc" },
    });

    // Serialize all results (Decimals → strings, Dates → ISO strings)
    const serialize = (rows) =>
      rows.map((row) => {
        const obj = {};
        for (const [key, value] of Object.entries(row)) {
          if (value === null || value === undefined) {
            obj[key] = null;
          } else if (typeof value === "bigint") {
            obj[key] = value.toString();
          } else if (value instanceof Date) {
            obj[key] = value.toISOString().split("T")[0];
          } else if (typeof value === "object" && value.constructor?.name === "Decimal") {
            obj[key] = value.toString();
          } else {
            obj[key] = String(value);
          }
        }
        return obj;
      });

    const serializePrismaJoin = (contacts) =>
      contacts.map((c) => ({
        contact_name: c.name,
        transaction_count: String(c.transactions.length),
        latest_transactions: c.transactions.map((t) => ({
          amount: t.amount.toString(),
          type: t.type,
          date: t.createdAt.toISOString().split("T")[0],
        })),
      }));

    return {
      success: true,
      innerJoin: serialize(innerJoinResults),
      leftJoin: serialize(leftJoinResults),
      rightJoin: serialize(rightJoinResults),
      fullOuterJoin: serialize(fullOuterJoinResults),
      prismaJoin: serializePrismaJoin(prismaJoinResults),
      // SQL equivalents for display
      sqlQueries: {
        innerJoin: `SELECT c."name", t."amount", t."type"\nFROM "Contact" c\nINNER JOIN "Transaction" t\n  ON c."id" = t."contactId"`,
        leftJoin: `SELECT c."name", t."amount", t."type"\nFROM "Contact" c\nLEFT JOIN "Transaction" t\n  ON c."id" = t."contactId"`,
        rightJoin: `SELECT c."name", t."amount", t."type"\nFROM "Contact" c\nRIGHT JOIN "Transaction" t\n  ON c."id" = t."contactId"`,
        fullOuterJoin: `SELECT c."name", t."amount", t."type"\nFROM "Contact" c\nFULL OUTER JOIN "Transaction" t\n  ON c."id" = t."contactId"`,
        prismaInclude: `db.contact.findMany({\n  include: {\n    transactions: true  // ← Prisma translates this to LEFT JOIN\n  }\n})`,
      },
    };
  } catch (error) {
    console.error("SQL JOINs demo error:", error);
    return {
      success: false,
      error: error.message || "Failed to execute SQL JOINs. Make sure the database is connected.",
      innerJoin: [],
      leftJoin: [],
      rightJoin: [],
      fullOuterJoin: [],
      prismaJoin: [],
      sqlQueries: {},
    };
  }
}
