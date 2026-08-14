# Low Level Design (LLD) - Hisab Kitab

## 1. Directory & Code Structure

The project follows a feature-driven, strict separation of concerns within a monorepo setup:

```
src/
├── app/                  # Next.js Routes & HTTP endpoints (Thin layer)
├── components/           # React UI components (Presentation only)
├── server/               # Backend logic (Isolated from UI)
│   ├── services/         # Orchestrates business logic
│   ├── repositories/     # Database access via Prisma
│   ├── validators/       # Zod schemas for input validation
│   └── realtime/         # SSE connection management
```

**Key Constraint:** `components/` modules are strictly forbidden from importing anything from `server/` directly. 

## 2. Database Schema (Prisma)

### 2.1 Core Entities
- **User / Account / Session**: NextAuth standard tables.
- **Shop**: Represents a business entity. Configures local settings (language, alerts).
- **ShopMember**: Link between `User` and `Shop` with a `Role` (OWNER, STAFF) and specific JSON permissions.
- **Contact**: Represents either a customer or a vendor. Fields include `balance`, `openingBalance`, `isDeleted`.
- **Transaction**: The core ledger entry.
  - Fields: `amount`, `type` (`YOU_GAVE`, `YOU_GOT`), `balanceAfter`.
  - Concurrency fields: `version`, `lockedBy`, `lockedAt`.
  - Soft Delete fields: `isDeleted`, `deletedAt`, `deletedBy`.
- **TransactionAudit**: Stores a detailed history (`oldValue`, `newValue`) of every edit or delete action for full traceability.

### 2.2 Extension Entities
- **Worker & Attendance & SalaryPayment**: For managing staff compensation.
- **Product & ProductBatch & StockEntry & Loss**: For inventory tracking.
- **PaperImportBatch & PaperImportPage**: Tracks the lifecycle of AI-extracted ledger documents.
- **EarningsRollup**: Pre-aggregated view of daily/monthly earnings for fast dashboard generation.

## 3. Transaction State & Concurrency Flow

When adding or editing a transaction:
1. **Validation**: API route validates the input payload using Zod.
2. **Locking & Transaction Isolation**: The `TransactionService` opens a Prisma database transaction.
   - It performs `SELECT * FROM Contact WHERE id = X FOR UPDATE` to exclusively lock the contact row.
3. **Calculation**: It calculates the new `balanceAfter` by applying the new transaction amount to the current contact balance.
4. **Commit**: 
   - The `Transaction` is inserted/updated.
   - The `Contact.balance` is updated.
   - A `TransactionAudit` record is created (if it's an edit or delete).
   - The db transaction commits.
5. **Real-time Event**: A notification is triggered on Postgres `LISTEN` channels or a Node.js Event Emitter, which is picked up by the SSE handler.

## 4. API Endpoints (App Router)

### 4.1 `/api/transactions`
- `POST /`: Add a new transaction (requires Contact ID, amount, type).
- `GET /`: Retrieve paginated transactions (cursor-based to ensure performance on deep scrolls).
- `PUT /:id`: Edit a transaction (requires version match, updates audit trail).
- `DELETE /:id`: Soft delete a transaction.

### 4.2 `/api/sse`
- Maintains an open HTTP connection to the client (`text/event-stream`).
- Pushes JSON payloads representing data changes (e.g., `BALANCE_UPDATE`, `TRANSACTION_LOCKED`).

## 5. Security & Access Control
- **Middleware**: Next.js middleware is used to verify session authenticity on protected routes.
- **Service-Level Checks**: Every service method explicitly checks if the executing user's `ShopMember` record has the required role/permissions for the action (e.g., checking if `staffCanDeleteTransactions` is true before allowing a deletion).

## 6. Frontend State Management
- Utilizing React hooks (`useState`, `useContext`) alongside custom hooks like `useSSE` to ingest real-time updates and apply them optimistically to the UI state.
- Forms are strictly typed using React Hook Form coupled with Zod resolvers (reusing the backend validator schemas).
