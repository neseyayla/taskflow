import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },
  setupFiles: ['<rootDir>/tests/jest.setup.ts'],
  globalSetup: '<rootDir>/tests/jest.globalSetup.ts',
  testMatch: ['**/*.test.ts']
};

export default config;

