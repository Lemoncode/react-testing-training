const base = require('./jest');

module.exports = {
  ...base,
  collectCoverage: true,
  coverageReporters: ['text'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/common/models',
    'src/common/constants',
    'src/core',
    'src/layouts',
    'src/scenes',
  ],
  collectCoverageFrom: ['**/*.{ts,tsx}'],
};
