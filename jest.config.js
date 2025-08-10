/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/domain/src'],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/domain/src/$1',
  },
};
