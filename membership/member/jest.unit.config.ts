import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
	verbose: true,
	name: 'unit',
	displayName: 'Unit Tests',
	preset: 'ts-jest',
	roots: [
	  'application',
	  'domain'
	],
  };
export default config;
