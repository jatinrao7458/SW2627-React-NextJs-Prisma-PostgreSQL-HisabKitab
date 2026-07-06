$base = "d:\PROJECTS\hisab kitab\SW2627-React-NextJs-Prisma-PostgreSQL-HisabKitab"

Write-Host ""
Write-Host "=== Restructuring into Monorepo ===" -ForegroundColor Green
Write-Host "    Frontend and Backend independently deployable" -ForegroundColor DarkGray
Write-Host ""

# ─── Step 1: Remove old flat structure (only .gitkeep files, safe to delete) ───
Write-Host "[1/3] Removing old flat structure..." -ForegroundColor Yellow

$oldDirs = @("src", "prisma", "public")
foreach ($d in $oldDirs) {
    $path = Join-Path $base $d
    if (Test-Path $path) {
        Remove-Item -Path $path -Recurse -Force
        Write-Host "  [-] Removed: $d/" -ForegroundColor Red
    }
}

# ─── Step 2: Create new monorepo structure ───
Write-Host ""
Write-Host "[2/3] Creating monorepo structure..." -ForegroundColor Yellow

$dirs = @(
    # ════════════════════════════════════════════════════════════════
    # apps/web — Next.js Frontend (independently deployable)
    # ════════════════════════════════════════════════════════════════

    # Pages & Layouts (App Router)
    "apps/web/src/app/(auth)"
    "apps/web/src/app/(dashboard)/dashboard"
    "apps/web/src/app/(dashboard)/contacts"
    "apps/web/src/app/(dashboard)/workers"
    "apps/web/src/app/(dashboard)/inventory"
    "apps/web/src/app/(dashboard)/settings"
    "apps/web/src/app/(dashboard)/notifications"

    # Components — presentation only
    "apps/web/src/components/ui"
    "apps/web/src/components/layout"
    "apps/web/src/components/features/contacts"
    "apps/web/src/components/features/transactions"
    "apps/web/src/components/features/dashboard"
    "apps/web/src/components/features/workers"
    "apps/web/src/components/features/inventory"
    "apps/web/src/components/features/paper-import"

    # Client-side hooks, utils, i18n
    "apps/web/src/hooks"
    "apps/web/src/lib"
    "apps/web/src/i18n/locales"
    "apps/web/src/styles"

    # Public / static assets
    "apps/web/public/icons"

    # ════════════════════════════════════════════════════════════════
    # apps/server — Backend API (independently deployable)
    # ════════════════════════════════════════════════════════════════

    # API Routes — one folder per resource
    "apps/server/src/routes/auth"
    "apps/server/src/routes/contacts"
    "apps/server/src/routes/transactions"
    "apps/server/src/routes/workers"
    "apps/server/src/routes/inventory"
    "apps/server/src/routes/notifications"
    "apps/server/src/routes/paper-import"
    "apps/server/src/routes/sse"
    "apps/server/src/routes/cron"

    # Business logic — use-case orchestration
    "apps/server/src/services"

    # Data access layer — wraps Prisma
    "apps/server/src/repositories"

    # Auth & role middleware
    "apps/server/src/middleware"

    # Real-time: pg-listener (LISTEN/NOTIFY -> SSE bridge)
    "apps/server/src/realtime"

    # Cron job handlers (expiry-check, rollup-repair)
    "apps/server/src/jobs"

    # Prisma client singleton, contact-lock, FCM, Gemini
    "apps/server/src/lib"

    # ════════════════════════════════════════════════════════════════
    # packages/shared — Shared code (used by BOTH web + server)
    # ════════════════════════════════════════════════════════════════

    # Shared TypeScript types (Contact, Transaction, Worker, etc.)
    "packages/shared/src/types"

    # Zod validators — one per resource, shared by API + forms
    "packages/shared/src/validators"

    # Feature flags, constants (roles, tx types, etc.)
    "packages/shared/src/config"

    # Shared utility functions (formatCurrency, dates, etc.)
    "packages/shared/src/utils"

    # ════════════════════════════════════════════════════════════════
    # packages/database — Prisma schema & client (used by server)
    # ════════════════════════════════════════════════════════════════

    # Prisma schema, migrations, seed
    "packages/database/prisma/migrations"

    # Prisma client singleton export
    "packages/database/src"

    # ════════════════════════════════════════════════════════════════
    # Root-level infrastructure (unchanged)
    # ════════════════════════════════════════════════════════════════

    # Docker (separate Dockerfiles for web + server)
    "docker/web"
    "docker/server"

    # Tests mirror apps structure
    "tests/web/unit"
    "tests/web/e2e"
    "tests/server/unit"
    "tests/server/integration"
)

foreach ($d in $dirs) {
    $fullPath = Join-Path $base $d
    if (!(Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "  [+] $d" -ForegroundColor Cyan
    }
}

# ─── Step 3: Add .gitkeep to all empty directories ───
Write-Host ""
Write-Host "[3/3] Adding .gitkeep placeholders..." -ForegroundColor Yellow

foreach ($d in $dirs) {
    $fullPath = Join-Path $base $d
    $children = Get-ChildItem -Path $fullPath -File -ErrorAction SilentlyContinue
    if ($null -eq $children -or $children.Count -eq 0) {
        $gitkeep = Join-Path $fullPath ".gitkeep"
        if (!(Test-Path $gitkeep)) {
            New-Item -ItemType File -Path $gitkeep -Force | Out-Null
        }
    }
}

Write-Host "  Done - .gitkeep added to all empty directories" -ForegroundColor DarkGray

Write-Host ""
Write-Host "=== Monorepo structure created! ===" -ForegroundColor Green
Write-Host ""
