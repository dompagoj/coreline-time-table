# electron-webpack-quick-start

Forked from https://github.com/electron-userland/electron-webpack-quick-start.

> A bare minimum project structure to get started developing with [`electron-webpack`](https://github.com/electron-userland/electron-webpack).

Thanks to the power of `electron-webpack` this template comes packed with...

* Use of [`webpack-dev-server`](https://github.com/webpack/webpack-dev-server) for development
* HMR for both `renderer` and `main` processes
* Use of [`babel-preset-env`](https://github.com/babel/babel-preset-env) that is automatically configured based on your `electron` version
* Use of [`electron-builder`](https://github.com/electron-userland/electron-builder) to package and build a distributable electron application

Make sure to check out [`electron-webpack`'s documentation](https://webpack.electron.build/) for more details.

## Getting Started
Simply clone down this reposity, install dependencies, and get started on your application.

# Install dependencies

### Development Scripts

```bash
# run application in development mode
npm run dev

# compile source code and create webpack output
npm run compile

# `yarn compile` & create build with electron-builder
npm run dist

# `yarn compile` & create unpacked build with electron-builder
npm run dist:dir
```
