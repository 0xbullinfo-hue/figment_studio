@echo off
git add constants.ts components/PortfolioGallery.tsx
git commit -m "fix: update Ondo metadata to Residential and rename title to Ondo Modern Residence"
git push origin master
echo Push completed with exit code: %ERRORLEVEL%
