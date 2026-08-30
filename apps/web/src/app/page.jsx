"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { demonstrateSqlJoinsFromDB } from "@/actions/viva-sql-joins";

export default function VivaPage() {
  const [logs, setLogs] = useState([]);
  const [joinsLoading, setJoinsLoading] = useState(false);

  const addLog = (msg) => {
    setLogs((prev) => [...prev, msg]);
  };

  // 1. JavaScript — Hoisting Example
  // In JS, function declarations and var declarations are hoisted.
  const demonstrateHoisting = () => {
    addLog("--- Demonstrating Hoisting ---");
    
    // We can call hoistedFunction before it's defined because of hoisting
    hoistedFunction();
    
    // var is hoisted but initialized as undefined
    addLog(`Value of hoistedVar before initialization: ${hoistedVar}`); 
    
    var hoistedVar = "I am hoisted!";
    addLog(`Value of hoistedVar after initialization: ${hoistedVar}`);
    
    function hoistedFunction() {
      addLog("I am a hoisted function! I was called before my declaration.");
    }
  };

  // 2. Closures Example
  // A closure gives you access to an outer function's scope from an inner function.
  const demonstrateClosure = () => {
    addLog("--- Demonstrating Closures ---");
    
    function makeCounter() {
      let count = 0; // count is enclosed
      return function() {
        count += 1;
        return count;
      };
    }

    const counter = makeCounter(); // makeCounter executes and returns the inner function
    addLog(`Counter first call: ${counter()}`); // 1
    addLog(`Counter second call: ${counter()}`); // 2
    addLog("The inner function remembers the 'count' variable even after makeCounter finished execution. That's a closure!");
  };

  // 3. JavaScript — Event loop Example
  // JS is single-threaded. The Event Loop manages the execution of code, collecting and processing events.
  const demonstrateEventLoop = () => {
    addLog("--- Demonstrating Event Loop ---");
    addLog("1. Sync execution starts (Call Stack)");

    setTimeout(() => {
      addLog("4. setTimeout callback executes (Macrotask Queue / Callback Queue)");
    }, 0);

    Promise.resolve().then(() => {
      addLog("3. Promise .then executes (Microtask Queue)");
    });

    addLog("2. Sync execution ends. Now Event loop will check Microtasks, then Macrotasks.");
  };

  // 4 & 5. Promises vs Callbacks & Async/Await
  const demonstratePromisesAndAsync = async () => {
    addLog("--- Demonstrating Promises vs Callbacks vs Async/Await ---");
    
    // Callback approach
    const simulateCallback = (callback) => {
      setTimeout(() => {
        callback("Callback result data");
      }, 500);
    };

    simulateCallback((data) => {
      addLog(`Callback result: ${data}`);
    });

    // Promise approach with Chaining
    const simulatePromise = (value) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(value ? `Promise result data: ${value}` : "Promise result data");
        }, 1000);
      });
    };

    simulatePromise("Step 1")
      .then((data) => {
        addLog(`Promise .then() result: ${data}`);
        return simulatePromise("Step 2"); // Chaining a new Promise
      })
      .then((data) => {
        addLog(`Promise .then() chained result: ${data}`);
        return "Immediate sync value"; // Chaining a synchronous value
      })
      .then((data) => {
        addLog(`Promise .then() final result: ${data}`);
      })
      .catch((error) => {
        addLog(`Promise .catch() error: ${error}`);
      });

    // Async/Await approach
    addLog("Waiting for async/await result...");
    try {
      const asyncData = await simulatePromise("Async Step");
      addLog(`Async/Await result: ${asyncData}`);
      addLog("Notice how async/await makes asynchronous code look synchronous and easier to read!");
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };

  // 6. Client-side routing (Frontend)
  const demonstrateRouting = () => {
    addLog("--- Demonstrating Client-Side Routing ---");
    addLog("In Next.js, client-side routing is handled by the <Link> component or useRouter hook.");
    addLog("Unlike traditional <a> tags that trigger a full page reload from the server, client-side routing intercepts the click.");
    addLog("It fetches only the necessary data/components and updates the DOM dynamically, resulting in instant SPA-like transitions.");
  };

  // 7. Schema Modeling (PostgreSQL / Prisma ORM)
  // Demonstrates how our relational schema is modeled using Prisma with PostgreSQL.
  const demonstratePrismaSchema = () => {
    addLog("--- Demonstrating Schema Modeling (PostgreSQL + Prisma ORM) ---");
    addLog("In HisabKitab, we use Prisma ORM with PostgreSQL for relational schema modeling.");
    addLog("The schema is defined in packages/database/prisma/schema.prisma:");
    addLog(`// Prisma Schema — Relational Modeling with PostgreSQL
model Contact {
  id      String  @id @default(cuid())
  shopId  String
  name    String
  balance Decimal @default(0) @db.Decimal(14, 2)

  // One-to-Many: A Contact has many Transactions
  shop         Shop          @relation(fields: [shopId], references: [id])
  transactions Transaction[]

  @@index([shopId, isDeleted])  // Composite index for fast queries
}`);
    addLog("Key Design Decisions in our PostgreSQL schema:");
    addLog("1. Decimal(14,2) for money — avoids floating-point precision errors (0.1 + 0.2 ≠ 0.3 in Float)");
    addLog("2. Foreign keys (shopId, contactId) enforce referential integrity — unlike NoSQL");
    addLog("3. Composite indexes (@@index) optimize queries that filter by multiple columns");
    addLog("4. Relations (shop, transactions) let Prisma generate SQL JOINs automatically via `include`");
    addLog(`// Example: Prisma's include translates to SQL LEFT JOIN
const contacts = await db.contact.findMany({
  include: { transactions: true }
});
// Prisma generates:
// SELECT ... FROM "Contact" 
// LEFT JOIN "Transaction" ON "Contact"."id" = "Transaction"."contactId"`);
    addLog("5. Soft deletes (isDeleted flag) preserve audit trail instead of permanent DELETE");
  };

  // Helper to render tables in the log
  const renderTable = (title, columns, data) => (
    <div style={{ margin: "1rem 0", backgroundColor: "#2d2d2d", padding: "1rem", borderRadius: "8px" }}>
      <h4 style={{ color: "#fff", marginBottom: "0.5rem" }}>{title}</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", color: "#e5e7eb", fontSize: "0.9rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #4ade80", textAlign: "left" }}>
            {columns.map(col => <th key={col} style={{ padding: "0.5rem" }}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #444" }}>
              {columns.map(col => (
                <td key={col} style={{ padding: "0.5rem" }}>
                  {row[col] === null ? <span style={{ color: "#f87171" }}>NULL</span> : String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Helper to render SQL code blocks
  const renderSqlBlock = (title, sql) => (
    <div style={{ margin: "1rem 0", backgroundColor: "#1a1a2e", padding: "1rem", borderRadius: "8px", border: "1px solid #4ade80" }}>
      <h4 style={{ color: "#4ade80", marginBottom: "0.5rem", fontSize: "0.85rem" }}>📄 {title}</h4>
      <pre style={{ color: "#e5e7eb", fontSize: "0.8rem", whiteSpace: "pre-wrap", margin: 0, fontFamily: "monospace" }}>
        {sql}
      </pre>
    </div>
  );

  // 8. SQL JOINs (PostgreSQL — Real Database Queries)
  // This calls a Server Action that executes actual SQL JOIN queries against PostgreSQL.
  const demonstrateSqlJoins = async () => {
    addLog("--- Demonstrating SQL JOINs (PostgreSQL — Real Database Queries) ---");
    addLog("SQL JOINs combine rows from two or more tables based on a related column (foreign key).");
    addLog("⏳ Querying PostgreSQL database with INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN...");
    setJoinsLoading(true);

    try {
      // Call the server action that executes real SQL JOINs on PostgreSQL
      const result = await demonstrateSqlJoinsFromDB();

      if (!result.success) {
        addLog(`❌ Error: ${result.error}`);
        addLog("Falling back to conceptual explanation...");
        demonstrateSqlJoinsFallback();
        return;
      }

      // Show the actual SQL queries and their results from PostgreSQL
      addLog("✅ All SQL JOINs executed successfully on PostgreSQL!");

      // INNER JOIN
      addLog(renderSqlBlock("INNER JOIN Query (PostgreSQL)", result.sqlQueries.innerJoin));
      if (result.innerJoin.length > 0) {
        addLog(renderTable("INNER JOIN Result (from DB)", ["contact_name", "amount", "type", "transaction_date"], result.innerJoin));
      } else {
        addLog("INNER JOIN returned 0 rows (no contacts with transactions yet).");
      }
      addLog("INNER JOIN returns ONLY rows where there is a match in BOTH tables.");

      // LEFT JOIN
      addLog(renderSqlBlock("LEFT JOIN Query (PostgreSQL)", result.sqlQueries.leftJoin));
      if (result.leftJoin.length > 0) {
        addLog(renderTable("LEFT JOIN Result (from DB)", ["contact_name", "amount", "type", "transaction_date"], result.leftJoin));
      } else {
        addLog("LEFT JOIN returned 0 rows (no contacts in the database yet).");
      }
      addLog("LEFT JOIN returns ALL rows from the left table (Contact), with NULLs where there is no match in the right table (Transaction).");

      // RIGHT JOIN
      addLog(renderSqlBlock("RIGHT JOIN Query (PostgreSQL)", result.sqlQueries.rightJoin));
      if (result.rightJoin.length > 0) {
        addLog(renderTable("RIGHT JOIN Result (from DB)", ["contact_name", "amount", "type", "transaction_date"], result.rightJoin));
      } else {
        addLog("RIGHT JOIN returned 0 rows (no transactions in the database yet).");
      }
      addLog("RIGHT JOIN returns ALL rows from the right table (Transaction), with NULLs where there is no match in the left table (Contact).");

      // FULL OUTER JOIN
      addLog(renderSqlBlock("FULL OUTER JOIN Query (PostgreSQL)", result.sqlQueries.fullOuterJoin));
      if (result.fullOuterJoin.length > 0) {
        addLog(renderTable("FULL OUTER JOIN Result (from DB)", ["contact_name", "amount", "type", "transaction_date"], result.fullOuterJoin));
      } else {
        addLog("FULL OUTER JOIN returned 0 rows (no data in the database yet).");
      }
      addLog("FULL OUTER JOIN returns ALL rows from BOTH tables, with NULLs where there is no match on either side.");

      // Prisma Include (ORM-level JOIN)
      addLog(renderSqlBlock("Prisma Include (translates to LEFT JOIN)", result.sqlQueries.prismaInclude));
      if (result.prismaJoin.length > 0) {
        const prismaFlat = result.prismaJoin.map(c => ({
          contact_name: c.contact_name,
          transaction_count: c.transaction_count,
        }));
        addLog(renderTable("Prisma Include Result", ["contact_name", "transaction_count"], prismaFlat));
      }
      addLog("Prisma's `include` clause generates SQL LEFT JOINs under the hood — this is how JOINs are used throughout HisabKitab!");

    } catch (err) {
      addLog(`❌ Database connection error: ${err.message}`);
      addLog("Falling back to conceptual explanation...");
      demonstrateSqlJoinsFallback();
    } finally {
      setJoinsLoading(false);
    }
  };

  // Fallback: Conceptual SQL JOINs explanation (when DB is not available)
  const demonstrateSqlJoinsFallback = () => {
    addLog("--- SQL JOINs Conceptual Demo (Fallback) ---");
    
    const contacts = [
      { id: 1, name: "Rahul" },
      { id: 2, name: "Priya" },
      { id: 3, name: "Amit" }
    ];
    
    const transactions = [
      { id: 101, contact_id: 1, amount: "₹250" },
      { id: 102, contact_id: 1, amount: "₹400" },
      { id: 103, contact_id: 2, amount: "₹150" }
    ];

    addLog(renderTable("Contacts Table", ["id", "name"], contacts));
    addLog(renderTable("Transactions Table", ["id", "contact_id", "amount"], transactions));

    const innerJoinResult = contacts.reduce((acc, c) => {
      const cTxns = transactions.filter(t => t.contact_id === c.id);
      cTxns.forEach(t => acc.push({ name: c.name, amount: t.amount }));
      return acc;
    }, []);
    addLog(renderTable("INNER JOIN Result", ["name", "amount"], innerJoinResult));
    addLog("Amit is excluded because he has no transactions (INNER JOIN).");

    const leftJoinResult = contacts.reduce((acc, c) => {
      const cTxns = transactions.filter(t => t.contact_id === c.id);
      if (cTxns.length > 0) {
        cTxns.forEach(t => acc.push({ name: c.name, amount: t.amount }));
      } else {
        acc.push({ name: c.name, amount: null });
      }
      return acc;
    }, []);
    addLog(renderTable("LEFT JOIN Result", ["name", "amount"], leftJoinResult));
    addLog("Amit is included with NULL amount (LEFT JOIN keeps all rows from left table).");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#333", fontWeight: "bold" }}>JavaScript Viva Concepts Demo</h1>
      <p style={{ marginBottom: "2rem", color: "#666", lineHeight: "1.5" }}>
        This page is created specifically for your Viva to easily demonstrate the requested JavaScript concepts. 
        Click the buttons below to run the code and explain the output in the console log area.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <button onClick={demonstrateHoisting} style={btnStyle}>1. Hoisting</button>
        <button onClick={demonstrateClosure} style={btnStyle}>2. Closures</button>
        <button onClick={demonstrateEventLoop} style={btnStyle}>3. Event Loop</button>
        <button onClick={demonstratePromisesAndAsync} style={btnStyle}>4 & 5. Promises & Async/Await</button>
        <button onClick={demonstrateRouting} style={btnStyle}>6. Client-Side Routing</button>
        <button onClick={demonstratePrismaSchema} style={btnStyle}>7. Prisma Schema (PostgreSQL)</button>
        <button onClick={demonstrateSqlJoins} disabled={joinsLoading} style={{ ...btnStyle, backgroundColor: joinsLoading ? "#6b7280" : "#059669" }}>
          {joinsLoading ? "⏳ Querying DB..." : "8. SQL JOINs (PostgreSQL)"}
        </button>
        <button onClick={() => setLogs([])} style={{ ...btnStyle, backgroundColor: "#ef4444" }}>Clear Logs</button>
      </div>

      <div style={{ backgroundColor: "#1e1e1e", color: "#4ade80", padding: "1rem", borderRadius: "8px", minHeight: "350px", fontFamily: "monospace" }}>
        <h3 style={{ borderBottom: "1px solid #333", paddingBottom: "0.5rem", marginBottom: "1rem", color: "#fff" }}>Output Log:</h3>
        {logs.length === 0 ? (
          <span style={{ color: "#888" }}>Waiting for actions...</span>
        ) : (
          logs.map((log, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ marginBottom: "0.5rem" }}
            >
              {typeof log === 'string' ? `> ${log}` : log}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "background-color 0.2s"
};
