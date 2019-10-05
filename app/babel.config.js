module.exports = {
  sourceType: 'unambiguous',
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.1%, not dead',
        useBuiltIns: 'usage', // https://babeljs.io/docs/en/babel-preset-env#usebuiltins,
        corejs: '3.0.1',
      },
    ],
    '@babel/preset-react',
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
        isTSX: true,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
    ['module-resolver', {
      root: ["./src/index.tsx"],
      alias: {
        "^assets/(.+)": "./src/assets/\\1",
        "^app/(.+)": "./src/\\1",
        "^shared/(.+)": "../shared/\\1",
      }
    }]
  ],
};
