$env:NODE_OPTIONS="--max-old-space-size=4096"
npx expo export --platform web
if (!(Test-Path "dist\.vercel")) { New-Item -ItemType Directory -Path "dist\.vercel" | Out-Null }
Copy-Item ".vercel\project.json" "dist\.vercel\project.json" -Force
Copy-Item "vercel.json" "dist\vercel.json" -Force
Set-Location dist
vercel --prod
Set-Location ..
