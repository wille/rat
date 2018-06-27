module.exports = {
    verbose: true,
    transform: {
        ".ts": "<rootDir>/node_modules/ts-jest/preprocessor.js"
    },
    moduleFileExtensions: [
        "js",
        "ts"
    ],
    testRegex: ".*\\.test.(ts|js)$",
    testEnvironment: "node"
}
