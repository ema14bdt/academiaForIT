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
  ],
  collectCoverageFrom: [
    '<rootDir>/domain/src/**/*.ts',
    '<rootDir>/apps/backend/src/**/*.ts',
  ],
  coverageDirectory: 'coverage',
};