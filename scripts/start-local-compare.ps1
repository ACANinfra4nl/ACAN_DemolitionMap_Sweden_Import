# Start NL / AU / DK from the same kauter-dev checkout.
# NL:  http://localhost:3000
# AU:  http://localhost:3001
# DK:  http://localhost:3002
# Hub: http://localhost:3999/local-compare-hub.html
#
# Each process overrides LANGUAGE + Sanity project id. Tokens and MapTiler
# still come from this folder's .env.local. Write tokens must belong to the
# project you are posting to.

$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent $PSScriptRoot

function Start-CountryDev {
  param(
    [string]$Name,
    [int]$Port,
    [string]$Language,
    [string]$ProjectId
  )
  Write-Host "Starting $Name on port $Port (LANGUAGE=$Language)"
  $dist = ".next-$Language"
  $cmd = "set LANGUAGE=$Language&& set NEXT_PUBLIC_SANITY_PROJECT_ID=$ProjectId&& set NEXT_DIST_DIR=$dist&& npm run dev -- -p $Port"
  Start-Process -FilePath "cmd.exe" -ArgumentList "/c", $cmd -WorkingDirectory $repo -WindowStyle Minimized
}

Start-CountryDev -Name "NL" -Port 3000 -Language "nl" -ProjectId "q9jkymv5"
Start-CountryDev -Name "AU" -Port 3001 -Language "au" -ProjectId "yps8kvw9"
Start-CountryDev -Name "DK" -Port 3002 -Language "dk" -ProjectId "obfbyt9x"

Write-Host "Starting compare hub on port 3999"
Start-Process -FilePath "npx" -ArgumentList "--yes","serve",$PSScriptRoot,"-p","3999" -WorkingDirectory $PSScriptRoot -WindowStyle Minimized

Start-Sleep -Seconds 2
Start-Process "http://localhost:3999/local-compare-hub.html"

Write-Host ""
Write-Host "NL  http://localhost:3000  (kaart / lijst)"
Write-Host "AU  http://localhost:3001  (map / list)"
Write-Host "DK  http://localhost:3002  (kort / liste)"
Write-Host "Hub http://localhost:3999/local-compare-hub.html"
