module.exports = {
    verbose: true,
    transform: {
        ".(ts|tsx)": "<rootDir>/node_modules/ts-jest/preprocessor.js"
    },
    moduleFileExtensions: [
        "js",
        "ts",
        "tsx"
    ],
    testRegex: ".*\\.test.(ts|tsx|js)$",
    testEnvironment: "jsdom"
}
