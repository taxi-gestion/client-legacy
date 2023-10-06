module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '@codecs': '<rootDir>/src/codecs',
    '@definitions': '<rootDir>/src/definitions',
    '@features/(.*)': '<rootDir>/src/features/$1'
  }
};
