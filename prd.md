# Product Requirements Document (PRD) - Hisab Kitab

## 1. Overview
**Hisab Kitab** is a digital khatabook/ledger application designed for shopkeepers. It replaces traditional paper-based bookkeeping with a real-time, multi-user, and audit-safe financial ledger. The app allows shopkeepers to easily manage transactions, track dues, and maintain a clear, un-editable (by standard staff) audit trail for all financial entries.

## 2. Problem Statement
Shopkeepers often struggle with:
- Knowing exactly who owes them money and whom they owe.
- Keeping track of financial records without the risk of physical ledgers getting lost or damaged.
- Ensuring multiple staff members can use the ledger simultaneously without overwriting each other's entries.
- Trusting digital solutions to prevent unauthorized edits or silent deletions by staff.

## 3. Target Audience
- Small to medium-sized retail shop owners (kirana stores, hardware shops, etc.).
- Shop staff and workers who help manage the daily operations and record entries.

## 4. Goals & Non-Goals

### Goals
- Provide a robust, real-time ledger for recording financial transactions (You Gave / You Got).
- Ensure data integrity with an unalterable audit trail.
- Support safe concurrent access by multiple users (owners and staff).
- Provide additional operational modules like Worker Management and Inventory Tracking.
- Make onboarding seamless via AI-assisted paper migration.

### Non-Goals
- Complex ERP features meant for large enterprises.
- Direct integration with banking systems for automated payment processing (in MVP).

## 5. Core Features
- **Real-time Running Balance**: Instant balance updates pushed via Server-Sent Events (SSE).
- **Transaction Management**: Add transactions per contact safely with race-condition prevention.
- **Audit Trail**: Every edit or soft-delete is tracked. Nothing is permanently lost.
- **Concurrency Control**: No simultaneous edits on the same transaction due to pessimistic + optimistic locking.
- **Role-Based Access Control (RBAC)**: Differentiated permissions for Owner and Staff.
- **Pagination**: Cursor-based paginated transaction history for fast loading at any depth.
- **Reminders & Due Dates**: Track pending payments with notifications.
- **Trash/Restore**: 7-day recovery window for soft-deleted items.
- **Multi-Shop Support**: Ability to manage multiple shops under one account.
- **PWA**: Installable, offline-aware capabilities.
- **Localization**: Hindi and English language toggle.

## 6. Extended Modules
- **Worker & Salary Management**: Track worker attendance (daily/monthly wage) and salary payouts.
- **Inventory & Loss Tracking**: Full product batch tracking, stock movements, and loss recording with approval workflows.
- **AI-Assisted Paper Khata Migration**: Upload photos of handwritten ledgers to extract contacts and balances using the Gemini API.

## 7. User Roles & Permissions
- **Owner**: Full access. Can add/edit/delete any transaction, manage staff, view financials, approve stock adjustments, and handle bulk imports.
- **Staff**: Limited access. Can add transactions. Can only edit/delete their own transactions (if configured). Cannot view high-level financial totals or manage shop settings. Cannot approve stock adjustments (only submit).
