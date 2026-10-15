const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const shellDist = path.join(rootDir, 'dist', 'apps', 'shell');
const remotesDir = path.join(shellDist, 'mf-remotes');
const remotes = ['roseApp', 'adminDashboard', 'authApp'];

console.log('🚀 Preparing production deployment bundle for Netlify / Vercel...');

if (!fs.existsSync(shellDist)) {
  console.error(`❌ Shell build directory not found at: ${shellDist}`);
  process.exit(1);
}

// 1. Remove old route-colliding root directories in shellDist if they exist
remotes.forEach((remote) => {
  const oldRootPath = path.join(shellDist, remote);
  if (fs.existsSync(oldRootPath)) {
    fs.rmSync(oldRootPath, { recursive: true, force: true });
    console.log(`🧹 Cleaned up old root directory: ${remote} to prevent route collision`);
  }
});

// 2. Ensure mf-remotes directory exists
if (!fs.existsSync(remotesDir)) {
  fs.mkdirSync(remotesDir, { recursive: true });
}

// 3. Copy remotes into mf-remotes subdirectories
remotes.forEach((remote) => {
  const src = path.join(rootDir, 'dist', 'apps', remote);
  const dest = path.join(remotesDir, remote);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    // Remove remote's standalone index.html
    const remoteIndexHtml = path.join(dest, 'index.html');
    if (fs.existsSync(remoteIndexHtml)) {
      fs.unlinkSync(remoteIndexHtml);
    }
    console.log(`✅ Copied ${remote} to mf-remotes/${remote}`);
  } else {
    console.warn(`⚠️ Warning: ${remote} build not found at: ${src}`);
  }
});

// 4. Write unified production module federation manifest pointing to mf-remotes
const prodManifest = {
  adminDashboard: '/mf-remotes/adminDashboard/mf-manifest.json',
  authApp: '/mf-remotes/authApp/mf-manifest.json',
  roseApp: '/mf-remotes/roseApp/mf-manifest.json',
};

const manifestPath = path.join(shellDist, 'module-federation.manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(prodManifest, null, 2) + '\n', 'utf8');
console.log(`✅ Generated production manifest at ${path.relative(rootDir, manifestPath)}`);

// 5. Ensure Netlify _redirects file
const redirectsPath = path.join(shellDist, '_redirects');
fs.writeFileSync(redirectsPath, '/*    /index.html   200\n', 'utf8');
console.log(`✅ Ensured SPA redirect rules at ${path.relative(rootDir, redirectsPath)}`);

console.log('🎉 Deployment bundle is ready in dist/apps/shell!');
