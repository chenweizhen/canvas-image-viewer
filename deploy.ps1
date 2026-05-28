param(
    [string]$version = "patch"
)

$ErrorActionPreference = "Stop"

Write-Host "=== 开始发布流程 ===" -ForegroundColor Cyan

# 1. 构建所有项目
Write-Host "`n1. 构建所有项目..." -ForegroundColor Yellow
pnpm run build:all

if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败！" -ForegroundColor Red
    exit 1
}

# 2. 提交所有内容到 Gitee（main 分支）
Write-Host "`n2. 提交源码到 Gitee..." -ForegroundColor Yellow
git checkout main
git add .
git commit -m "chore: update source code"
git push gitee main

if ($LASTEXITCODE -ne 0) {
    Write-Host "推送 Gitee 失败！" -ForegroundColor Red
    exit 1
}

# 3. 提交到 GitHub（release 分支，排除 src）
Write-Host "`n3. 准备 GitHub release 分支..." -ForegroundColor Yellow

# 检查是否存在 release 分支
$branchExists = git branch --list release
if (-not $branchExists) {
    Write-Host "创建 release 分支..."
    git checkout -b release
} else {
    Write-Host "切换到 release 分支..."
    git checkout release
}

# 合并 main 分支的最新更改
Write-Host "合并 main 分支..."
git merge main --no-edit

# 删除 canvas-image-viewer/src 目录（不提交到 GitHub）
$srcPath = "canvas-image-viewer/src"
if (Test-Path $srcPath) {
    Write-Host "删除 $srcPath..."
    Remove-Item -Path $srcPath -Recurse -Force
    git rm -rf $srcPath
}

# 提交到 GitHub
Write-Host "提交到 GitHub..."
git add .
git commit -m "chore: release build (without src)"
git push github release

if ($LASTEXITCODE -ne 0) {
    Write-Host "推送 GitHub 失败！" -ForegroundColor Red
    exit 1
}

# 4. 切回主分支
Write-Host "`n4. 切回主分支..." -ForegroundColor Yellow
git checkout main

Write-Host "`n=== 发布完成 ===" -ForegroundColor Green
Write-Host "Gitee (main): 完整源码已推送" -ForegroundColor Green
Write-Host "GitHub (release): 排除 src 的产物已推送" -ForegroundColor Green