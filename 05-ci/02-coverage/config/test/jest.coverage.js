const base = require('./jest');

module.exports = {
  ...base,
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 80,
      lines: 80,
      statements: -10,
    },
    'src/**/*reducer.ts': {
      branches: 100,
    },
  },
  coveragePathIgnorePatterns: ['node_modules', 'src/common/test'],
  collectCoverageFrom: ['**/*.{ts,tsx}'],
};
