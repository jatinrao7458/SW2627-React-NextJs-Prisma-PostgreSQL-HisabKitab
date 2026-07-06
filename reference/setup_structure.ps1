$base = "d:\PROJECTS\hisab kitab\SW2627-React-NextJs-Prisma-PostgreSQL-HisabKitab"

Write-Host "=== Creating Hisab Kitab Production Folder Structure ===" -ForegroundColor Green
Write-Host ""

# ─── All directories to create ───
$dirs = @(
    # Reference docs folder
    "reference"

    # ─── src/app (Next.js App Router — routes ONLY, thin) ───
    "src/app/(auth)"
    "src/app/(dashboard)/dashboard"
    "src/app/(dashboard)/contacts"
    "src/app/(dashboard)/workers"
    "src/app/(dashboard)/inventory"
    "src/app/(dashboard)/settings"
    "src/app/api/auth"
    "src/app/api/contacts"
    "src/app/api/transactions"
    "src/app/api/workers"
    "src/app/api/inventory"
    "src/app/api/notifications"
    "src/app/api/paper-import"
    "src/app/api/sse"
    "src/app/api/cron"

    # ─── src/components (FRONTEND — presentation only) ───
    "src/components/ui"
    "src/components/layout"
    "src/components/features/contacts"
    "src/components/features/transactions"
    "src/components/features/dashboard"
    "src/components/features/workers"
    "src/components/features/inventory"

    # ─── src/server (BACKEND — all business logic) ───
    "src/server/services"
    "src/server/repositories"
    "src/server/validators"
    "src/server/middleware"
    "src/server/realtime"
    "src/server/jobs"
    "src/server/lib"

    # ─── src/ shared modules ───
    "src/hooks"
    "src/lib"
    "src/i18n/locales"
    "src/config"
    "src/types"

    # ─── Prisma ───
    "prisma/migrations"

    # ─── Docker ───
    "docker"

    # ─── Infrastructure ───
    "infra/gcp"
    "infra/cron"
    "infra/docker"

    # ─── CI/CD ───
    ".github/workflows"

    # ─── Scripts ───
    "scripts"

    # ─── Tests (mirror src/ structure) ───
    "tests/unit"
    "tests/integration"
    "tests/e2e"

    # ─── Public assets ───
    "public/icons"

    # ─── Documentation ───
    "docs"
)

# Create all directories
foreach ($d in $dirs) {
    $fullPath = Join-Path $base $d
    if (!(Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "  [+] Created: $d" -ForegroundColor Cyan
    } else {
        Write-Host "  [=] Exists:  $d" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "=== Moving reference files to reference/ ===" -ForegroundColor Green
Write-Host ""

# ─── Move .docx files ───
$docxFiles = Get-ChildItem -Path $base -Filter "*.docx" -File
foreach ($f in $docxFiles) {
    $dest = Join-Path $base "reference" $f.Name
    Move-Item -Path $f.FullName -Destination $dest -Force
    Write-Host "  [>] Moved: $($f.Name)" -ForegroundColor Yellow
}

# ─── Move extracted .txt files (not readme) ───
$txtFiles = @(
    "app_flow.txt"
    "features.txt"
    "folder_structure.txt"
    "impl_plan.txt"
    "prd.txt"
    "schema.txt"
    "trd.txt"
)
foreach ($f in $txtFiles) {
    $src = Join-Path $base $f
    if (Test-Path $src) {
        $dest = Join-Path $base "reference" $f
        Move-Item -Path $src -Destination $dest -Force
        Write-Host "  [>] Moved: $f" -ForegroundColor Yellow
    }
}

# ─── Move the extraction script ───
$extractScript = Join-Path $base "extract_docs.ps1"
if (Test-Path $extractScript) {
    $dest = Join-Path $base "reference" "extract_docs.ps1"
    Move-Item -Path $extractScript -Destination $dest -Force
    Write-Host "  [>] Moved: extract_docs.ps1" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Creating placeholder .gitkeep files ===" -ForegroundColor Green
Write-Host ""

# Add .gitkeep to empty directories so Git tracks them
foreach ($d in $dirs) {
    $fullPath = Join-Path $base $d
    $items = Get-ChildItem -Path $fullPath -File -ErrorAction SilentlyContinue
    if ($null -eq $items -or $items.Count -eq 0) {
        $gitkeep = Join-Path $fullPath ".gitkeep"
        if (!(Test-Path $gitkeep)) {
            New-Item -ItemType File -Path $gitkeep -Force | Out-Null
            Write-Host "  [.] .gitkeep: $d" -ForegroundColor DarkGray
        }
    }
}

Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Green
Write-Host ""
