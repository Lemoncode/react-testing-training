module.exports = {
  rootDir: '../../',
  preset: 'ts-jest',
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/config/test/setup-after.ts'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test|steps).[jt]s?(x)',
  ],
};
