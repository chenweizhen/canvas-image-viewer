param(
    [string]$version = "patch"
)

$ErrorActionPreference = "Stop"

Write-Host "=== Starting deployment process ===" -ForegroundColor Cyan

# 1. Build all projects
Write-Host "`n1. Building all projects..." -ForegroundColor Yellow
pnpm run build:all

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# 2. Push all to Gitee (main branch)
Write-Host "`n2. Pushing source code to Gitee..." -ForegroundColor Yellow
git checkout main
git add .
git commit -m "chore: update source code"
git push gitee main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push to Gitee!" -ForegroundColor Red
    exit 1
}

# 3. Push to GitHub (release branch, exclude src)
Write-Host "`n3. Preparing GitHub release branch..." -ForegroundColor Yellow

$branchExists = git branch --list release
if (-not $branchExists) {
    Write-Host "Creating release branch..."
    git checkout -b release
} else {
    Write-Host "Switching to release branch..."
    git checkout release
}

Write-Host "Merging main branch..."
git merge main --no-edit

# Remove canvas-image-viewer/src directory
$srcPath = "canvas-image-viewer/src"
if (Test-Path $srcPath) {
    Write-Host "Removing $srcPath..."
    Remove-Item -Path $srcPath -Recurse -Force
    git rm -rf $srcPath
}

Write-Host "Pushing to GitHub..."
git add .
git commit -m "chore: release build (without src)"
git push github release

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push to GitHub!" -ForegroundColor Red
    exit 1
}

# 4. Switch back to main branch
Write-Host "`n4. Switching back to main branch..." -ForegroundColor Yellow
git checkout main

Write-Host "`n=== Deployment completed ===" -ForegroundColor Green
Write-Host "Gitee (main): Full source code pushed" -ForegroundColor Green
Write-Host "GitHub (release): Build artifacts pushed (src excluded)" -ForegroundColor Green