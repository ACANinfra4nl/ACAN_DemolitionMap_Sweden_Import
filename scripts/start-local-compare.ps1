# Start NL / AU / DK local Next.js apps for side-by-side comparison.
# NL:  http://localhost:3000
# AU:  http://localhost:3001
# DK:  http://localhost:3002
# Hub: http://localhost:3999

$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent $PSScriptRoot
$nl = "C:\Users\hardw\GitHub\ACAN_DemolitionMap_NL"
$au = "C:\Users\hardw\GitHub\ACAN_DemolitionMap_AU"
$dk = $repo

function Start-CountryDev {
  param(
    [string]$Name,
    [string]$Path,
    [int]$Port
  )
  if (-not (Test-Path (Join-Path $Path "package.json"))) {
    throw "Missing $Name worktree at $Path"
  }
  Write-Host "Starting $Name on port $Port from $Path"
  Start-Process -FilePath "npm" -ArgumentList "run","dev","--","-p",$Port -WorkingDirectory $Path -WindowStyle Minimized
}

Start-CountryDev -Name "NL" -Path $nl -Port 3000
Start-CountryDev -Name "AU" -Path $au -Port 3001
Start-CountryDev -Name "DK" -Path $dk -Port 3002

$hub = Join-Path $PSScriptRoot "local-compare-hub.html"
Write-Host "Starting compare hub on port 3999"
Start-Process -FilePath "npx" -ArgumentList "--yes","serve",$PSScriptRoot,"-p","3999" -WorkingDirectory $PSScriptRoot -WindowStyle Minimized

Start-Sleep -Seconds 2
Start-Process "http://localhost:3999/local-compare-hub.html"

Write-Host ""
Write-Host "NL  http://localhost:3000  (kaart / lijst)"
Write-Host "AU  http://localhost:3001  (map / list)"
Write-Host "DK  http://localhost:3002  (kort / liste)"
Write-Host "Hub http://localhost:3999/local-compare-hub.html"
