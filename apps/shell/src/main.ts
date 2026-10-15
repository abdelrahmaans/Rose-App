import { registerRemotes } from '@module-federation/enhanced/runtime';

const defaultRemotes = [
  { name: 'adminDashboard', entry: '/mf-remotes/adminDashboard/mf-manifest.json' },
  { name: 'authApp', entry: '/mf-remotes/authApp/mf-manifest.json' },
  { name: 'roseApp', entry: '/mf-remotes/roseApp/mf-manifest.json' },
];

function bootstrapApp(): void {
  import('./bootstrap').catch((err) => {
    console.error('Failed to bootstrap application:', err);
  });
}

fetch('/module-federation.manifest.json')
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Manifest HTTP ${res.status}`);
    }
    return res.json();
  })
  .then((remotes: Record<string, string>) =>
    Object.entries(remotes).map(([name, entry]) => ({ name, entry })),
  )
  .catch((err) => {
    console.warn('Could not load remote manifest, falling back to local remotes:', err);
    return defaultRemotes;
  })
  .then((remotes) => registerRemotes(remotes))
  .catch((err) => {
    console.error('Remote registration warning:', err);
  })
  .finally(() => {
    bootstrapApp();
  });

