module.exports = {
  roots: ['<rootDir>/src/__tests__'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '^.+\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'jest-puppeteer',
};
