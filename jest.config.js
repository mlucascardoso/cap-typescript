const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { paths } = require('./tsconfig').compilerOptions;

module.exports = {
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
    roots: ['<rootDir>/tests', '<rootDir>/srv'],
    collectCoverageFrom: ['<rootDir>/srv/**/*.js'],
    coverageDirectory: 'coverage',
    coverageProvider: 'babel',
    testEnvironment: 'node',
    transform: {
        '.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
        ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>' }),
    },
};
