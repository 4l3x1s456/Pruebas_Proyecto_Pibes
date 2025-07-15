module.exports = {
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverage: false,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testMatch: [
        '**/tests/**/*.test.js',
        '**/tests/**/*.spec.js'
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/tests/',
        '/coverage/',
        '/public/'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    verbose: true,
    forceExit: true,
    detectOpenHandles: true
};
