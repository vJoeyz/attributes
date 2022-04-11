module.exports = {
  transform: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    '<rootDir>/fileTransformer.js',
    '^.+\\.svelte$': [
      'svelte-jester',
      {
        preprocess: true,
      },
    ],
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'svelte', 'svg'],
  setupFiles: ['./__mocks__/client.js'],
  modulePathIgnorePatterns: ['tests/*'],
  moduleNameMapper: {
    '^@src(.*)$': '<rootDir>/src$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js']
};
