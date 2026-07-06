$basePath = "d:\PROJECTS\hisab kitab\SW2627-React-NextJs-Prisma-PostgreSQL-HisabKitab"
$word = New-Object -ComObject Word.Application
$word.Visible = $false

$files = @(
    @{ src = "Hisab_Kitab_App_Flow.docx"; dst = "app_flow.txt" },
    @{ src = "Final feature list  for hisab kitab.docx"; dst = "features.txt" },
    @{ src = "Hisab_Kitab_PRD.docx"; dst = "prd.txt" },
    @{ src = "Hisab_Kitab_TRD (1).docx"; dst = "trd.txt" },
    @{ src = "Hisab_Kitab_Backend_Schema.docx"; dst = "schema.txt" },
    @{ src = "Hisab_Kitab_Implementation_Plan.docx"; dst = "impl_plan.txt" },
    @{ src = "Hisab_Kitab_Folder_Structure.docx"; dst = "folder_structure.txt" }
)

foreach ($f in $files) {
    $srcPath = Join-Path $basePath $f.src
    $dstPath = Join-Path $basePath $f.dst
    Write-Host "Processing $($f.src)..."
    $doc = $word.Documents.Open($srcPath)
    $doc.Content.Text | Out-File -FilePath $dstPath -Encoding utf8
    $doc.Close()
}

$word.Quit()
Write-Host "Done!"
