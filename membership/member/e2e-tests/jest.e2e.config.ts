import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
	displayName: 'End-to-end Tests',
	preset: 'ts-jest',
	testMatch: [
		"**/jest-cucumber-setup.ts"
	  ],
	transform: {
	"^.+\\.(ts|tsx)$": "ts-jest"
	},
  };
export default config;
