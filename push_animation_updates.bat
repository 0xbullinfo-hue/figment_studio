@echo off
git add -A
git commit -m "feat: use Press Play cover for all gallery animations and add 3D-Villa-Animation-Abuja to Signature section with custom villa cover"
git push origin master
echo Push completed with exit code: %ERRORLEVEL%
