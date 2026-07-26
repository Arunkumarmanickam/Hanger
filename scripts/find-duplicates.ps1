$assetsDir = "D:\Arun\hanger\assets"
$files = Get-ChildItem -LiteralPath $assetsDir -Recurse -Filter *.mp3
$total = $files.Count

Write-Host "Scanning $total MP3 files for duplicates..." -ForegroundColor Cyan
Write-Host ""

$hashGroups = @{}
$i = 0
foreach ($f in $files) {
  $i++
  $pct = [math]::Round(($i / $total) * 100, 1)
  Write-Progress -Activity "Hashing MP3s" -Status "$i / $total ($pct%)" -CurrentOperation $f.Name -PercentComplete $pct
  $hash = (Get-FileHash -LiteralPath $f.FullName -Algorithm MD5).Hash
  if (-not $hashGroups.ContainsKey($hash)) {
    $hashGroups[$hash] = @()
  }
  $hashGroups[$hash] += $f.FullName
}

Write-Progress -Activity "Hashing MP3s" -Completed

$duplicates = $hashGroups.GetEnumerator() | Where-Object { $_.Value.Count -gt 1 } | Sort-Object { $_.Value.Count } -Descending

if ($duplicates.Count -eq 0) {
  Write-Host "No duplicate files found." -ForegroundColor Green
  exit
}

$totalDupSize = 0
foreach ($dup in $duplicates) {
  $files2 = $dup.Value
  $size = (Get-Item -LiteralPath $files2[0]).Length
  $extraSize = $size * ($files2.Count - 1)
  $totalDupSize += $extraSize
}

Write-Host "Found $($duplicates.Count) groups of duplicate files." -ForegroundColor Yellow
Write-Host "Potential savings: $([math]::Round($totalDupSize / 1MB, 2)) MB" -ForegroundColor Yellow
Write-Host ""

foreach ($dup in $duplicates) {
  $files2 = $dup.Value
  $size = (Get-Item -LiteralPath $files2[0]).Length
  Write-Host "--- Duplicate group (hash: $($dup.Name.Substring(0,16))...) ---" -ForegroundColor Magenta
  Write-Host "  Size: $([math]::Round($size / 1MB, 2)) MB each, $($files2.Count) copies"
  foreach ($fp in $files2) {
    $rel = $fp.Substring($assetsDir.Length + 1)
    Write-Host "  > $rel"
  }
  Write-Host ""
}

$confirm = Read-Host "Delete all duplicates (keep first copy of each)? (y/n)"
if ($confirm -eq 'y') {
  $deleted = 0
  $saved = 0
  foreach ($dup in $duplicates) {
    $files2 = $dup.Value
    $size = (Get-Item -LiteralPath $files2[0]).Length
    # Keep first, delete rest
    foreach ($fp in $files2 | Select-Object -Skip 1) {
      Remove-Item -LiteralPath $fp -Force
      $deleted++
      $saved += $size
    }
  }
  Write-Host ""
  Write-Host "Deleted $deleted duplicate files." -ForegroundColor Green
  Write-Host "Saved $([math]::Round($saved / 1MB, 2)) MB of space." -ForegroundColor Green
} else {
  Write-Host "No files deleted." -ForegroundColor Cyan
}
