# High Level Design (HLD) - Hisab Kitab

## 1. System Architecture Overview
The Hisab Kitab application follows a modern cloud-native, client-server architecture built around a monorepo setup. The core logic and presentation are tightly integrated using a full-stack framework (Next.js) with clearly separated layers for frontend UI and backend business logic.

### 1.1 Architecture Tiers
- **Client Tier (Frontend)**: Next.js React Application serving as a Progressive Web App (PWA). It manages UI state, client-side routing, and optimistic UI updates.
- **Application Tier (Backend)**: Next.js App Router API Routes (`app/api/*`) act as the entry points, delegating core business logic to the internal `server/services/` layer.
- **Data Tier (Database)**: PostgreSQL managed via Prisma ORM for relational data storage, offering strong ACID compliance necessary for financial ledgers.

## 2. Technology Stack
- **Frontend Framework**: Next.js (App Router), React
- **Backend Framework**: Next.js API Routes (Node.js/Edge)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Infrastructure / Hosting**: Google Cloud Platform (GCP Cloud Run)
- **Real-time Engine**: PostgreSQL `LISTEN`/`NOTIFY` coupled with Server-Sent Events (SSE)
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **AI Integration**: Gemini API for document parsing (Paper Khata migration)
- **File Storage**: GCP Cloud Storage or equivalent object storage (for attachments/receipts)

## 3. Core System Components

### 3.1 Next.js Application
- **`app/`**: Contains thin route definitions. API routes (`app/api/`) only handle HTTP parsing, authentication checks, and input validation.
- **`components/`**: Pure UI layer. It never directly accesses the database or server internals.
- **`server/`**: The Backend domain.
  - **`services/`**: Orchestrates use-cases (e.g., adding a transaction, running balance calculations).
  - **`repositories/`**: The Data Access Layer. Wraps Prisma calls to contain database logic and schema changes.

### 3.2 Real-time Sync & Concurrency (The Ledger Engine)
Handling concurrent ledger edits reliably is the most critical architectural requirement.
- **Hybrid Locking Mechanism**:
  - *Pessimistic Lock (UX level)*: When User A starts editing a transaction, a lock state is broadcasted to prevent User B from opening the same edit modal.
  - *Optimistic Lock (DB level)*: Transactions have a `version` field. An update requires matching the current version; if it doesn't match, the transaction fails and the user is alerted (prevents lost updates).
- **Row-level Locking**: Balance calculations utilize Postgres `SELECT ... FOR UPDATE` when touching the `Contact` row, ensuring atomic running balance recalculations.
- **Server-Sent Events (SSE)**: Built over Postgres `LISTEN/NOTIFY`. When a transaction is recorded, a Postgres trigger or application-level event notifies the SSE endpoint, which pushes the update instantly to connected clients (eliminating manual page refreshes).

## 4. Extended Systems
- **AI Paper Migration Engine**: Receives images of old ledgers, queries the Gemini Vision API for tabular data extraction (Names and Balances), and formats it into a pending state. A human-in-the-loop review is mandatory before committing to the DB.
- **Cron Jobs & Schedulers**: Handled by external schedulers (cron-job.org or GCP Cloud Scheduler) hitting secure `/api/cron/*` endpoints for daily backups, due date reminders, and rollups.

## 5. Security & Deployment
- **Deployment**: Containerized via Docker. Hosted on GCP Cloud Run for stateless, auto-scaling execution.
- **Authentication**: Managed via NextAuth.js, supporting multi-tenant shop environments.
- **Data Deletion**: Strictly Soft Deletes (`isDeleted = true`) everywhere to maintain historical audit logs and support a 7-day Trash recovery feature.
