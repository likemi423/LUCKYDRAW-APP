@echo off
echo ====================================
echo   LUCKY DRAW - 正在启动本地服务...
echo ====================================
echo.
echo 启动完成后请在浏览器打开:
echo   http://localhost:8080
echo.
echo 关闭此窗口即可停止服务
echo ====================================
npx --yes serve . -p 8080 -s
pause
