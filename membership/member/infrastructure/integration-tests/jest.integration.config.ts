import type {Config} from '@jest/types'

const config: Config.InitialOptions = {
	verbose: true,
	name: 'unit',
	displayName: 'Integration Tests',
	preset: 'ts-jest',
	setupFiles: ["./setup-before-env.ts"],
  }
export default config
