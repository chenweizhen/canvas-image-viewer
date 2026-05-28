param(
    [string]$version = "patch"
)

Write-Host "=== 开始发布流程 ==="

# 1. 构建项目
Write-Host "`n1. 构建项目..."
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败！" -ForegroundColor Red
    exit 1
}

# 2. 提交源码到 Gitee（main 分支）
Write-Host "`n2. 提交源码到 Gitee..."
git checkout main
git add .
git commit -m "chore: update source code"
git push gitee main

# 3. 同步产物到 release 分支并推送到 GitHub
Write-Host "`n3. 更新 release 分支并推送到 GitHub..."
git checkout release

# 合并 main 分支的 dist 和其他必要文件
git checkout main -- dist/ README.md LICENSE package.json

git add .
git commit -m "chore: update dist files"
git push github release

# 4. 切回主分支
git checkout main

Write-Host "`n=== 发布完成 ===" -ForegroundColor Green