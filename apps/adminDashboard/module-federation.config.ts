import { ModuleFederationConfig, SharedFunction } from '@nx/module-federation';

const shared: SharedFunction = (libraryName, defaultConfig) => {
  if (libraryName === '@lucide/angular') {
    return false;
  }
  return defaultConfig;
};

const config: ModuleFederationConfig = {
  name: 'adminDashboard',
  exposes: {
    './Routes': 'apps/adminDashboard/src/app/remote-entry/entry.routes.ts',
  },
  shared,
};

export default config;

