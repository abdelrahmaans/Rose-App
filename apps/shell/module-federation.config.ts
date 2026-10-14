import { ModuleFederationConfig, SharedFunction } from '@nx/module-federation';

const shared: SharedFunction = (libraryName, defaultConfig) => {
  if (libraryName === '@lucide/angular') {
    return false;
  }
  return defaultConfig;
};

const config: ModuleFederationConfig = {
  name: 'shell',
  remotes: [],
  shared,
};

export default config;

