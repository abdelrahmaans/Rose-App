const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const shellDist = path.join(rootDir, 'dist', 'apps', 'shell');
const remotes = ['roseApp', 'adminDashboard', 'authApp'];

console.log('🚀 Preparing production deployment bundle for Netlify / Vercel...');

if (!fs.existsSync(shellDist)) {
  console.error(`❌ Shell build directory not found at: ${shellDist}`);
  process.exit(1);
}

// 1. Copy remotes into shell subdirectories
remotes.forEach((remote) => {
  const src = path.join(rootDir, 'dist', 'apps', remote);
  const dest = path.join(shellDist, remote);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    // Remove remote's standalone index.html to prevent static hosts (Vercel/Netlify) from serving it on route refresh
    const remoteIndexHtml = path.join(dest, 'index.html');
    if (fs.existsSync(remoteIndexHtml)) {
      fs.unlinkSync(remoteIndexHtml);
      console.log(`🧹 Removed ${remote}/index.html to prevent route collision on refresh.`);
    }
    console.log(`✅ Copied ${remote} to ${path.relative(rootDir, dest)}`);
  } else {
    console.warn(`⚠️ Warning: ${remote} build not found at: ${src}`);
  }
});

// 2. Write unified production module federation manifest
const prodManifest = {
  adminDashboard: '/adminDashboard/mf-manifest.json',
  authApp: '/authApp/mf-manifest.json',
  roseApp: '/roseApp/mf-manifest.json',
};

const manifestPath = path.join(shellDist, 'module-federation.manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(prodManifest, null, 2) + '\n', 'utf8');
console.log(`✅ Generated production manifest at ${path.relative(rootDir, manifestPath)}`);

// 3. Ensure Netlify _redirects file
const redirectsPath = path.join(shellDist, '_redirects');
fs.writeFileSync(redirectsPath, '/*    /index.html   200\n', 'utf8');
console.log(`✅ Ensured SPA redirect rules at ${path.relative(rootDir, redirectsPath)}`);

console.log('🎉 Deployment bundle is ready in dist/apps/shell!');
