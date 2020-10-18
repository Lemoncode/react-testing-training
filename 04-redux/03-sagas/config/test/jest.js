module.exports = {
  rootDir: '../../',
  preset: 'ts-jest',
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/config/test/setup-after.ts'],
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
};
