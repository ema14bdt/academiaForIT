/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  projects: [
    {
      displayName: 'domain',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/domain/src/**/*.test.ts'],
      transform: {
        '^.+\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/domain/tsconfig.json' }],
      },
      moduleNameMapper: {
        '^@domain/(.*)$': '<rootDir>/domain/src/$1',
      },
    },
    {
      displayName: 'backend',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/apps/backend/src/**/*.spec.ts',
        '<rootDir>/apps/backend/test/**/*.e2e-spec.ts',
      ],
      transform: {
        '^.+\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/apps/backend/tsconfig.json' }],
      },
      moduleNameMapper: {
        '^@domain/(.*)$': '<rootDir>/domain/src/$1',
      },
    },
    {
      displayName: 'frontend',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/apps/frontend/src/**/__tests__/**/*.{ts,tsx}',
        '<rootDir>/apps/frontend/src/**/?(*.)+(spec|test).{ts,tsx}'
      ],
      setupFilesAfterEnv: ['<rootDir>/apps/frontend/src/setupTests.ts'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { 
          tsconfig: '<rootDir>/apps/frontend/tsconfig.json',
          useESM: false
        }],
      },
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/apps/frontend/src/$1',
      },
      testPathIgnorePatterns: ['<rootDir>/apps/frontend/node_modules/'],
      extensionsToTreatAsEsm: [],
    },
  ],
  collectCoverageFrom: [
    '<rootDir>/domain/src/**/*.ts',
    '<rootDir>/apps/backend/src/**/*.ts',
    '<rootDir>/apps/frontend/src/**/*.{ts,tsx}',
    '!<rootDir>/apps/frontend/src/**/*.d.ts',
    '!<rootDir>/apps/frontend/src/**/*.stories.{ts,tsx}',
    '!<rootDir>/apps/frontend/src/main.tsx',
    '!<rootDir>/apps/frontend/src/vite-env.d.ts',
    '!<rootDir>/apps/frontend/src/setupTests.ts',
  ],
  coverageDirectory: 'coverage',
};