import { ModuleFederationConfig, SharedFunction } from '@nx/module-federation';

const shared: SharedFunction = (libraryName, defaultConfig) => {
  if (libraryName === '@lucide/angular') {
    return false;
  }
  return defaultConfig;
};

const config: ModuleFederationConfig = {
  name: 'roseApp',
  exposes: {
    './Routes': 'apps/roseApp/src/app/remote-entry/entry.routes.ts',
    './CheckoutRoutes': 'apps/roseApp/src/app/remote-entry/checkout.routes.ts',
  },
  shared,
};

export default config;

