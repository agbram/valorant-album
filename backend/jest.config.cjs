module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov'],
  testMatch: ['<rootDir>/**/*test.ts', '<rootDir>/**/*spec.ts'],
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', { tsconfig: { allowJs: true } }]
  },
  transformIgnorePatterns: ['node_modules'],
}