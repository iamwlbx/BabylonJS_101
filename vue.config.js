// npm i path-browserify
// Webpack 无法解析 'path' 和 'fs' 模块，这些模块通常是 Node.js 的核心模块。
// 这是因为新版本的 Webpack 不再默认包含 Node.js 核心模块的 polyfill
// 告诉 Webpack 在解析 'path' 模块时使用 'path-browserify' 模块作为 polyfill
/**
 * webpack与polyfill    polyfill => 一些功能
 * 
 * 以前版本的 Webpack 版本中会自动包含一些用于模拟 Node.js 核心模块行为的代码，以便在浏览器环境中使用。
 * 如 'fs'（文件系统）和 'path'（路径处理），但这些模块在浏览器中是不可用的
 * 这些核心模块的功能会被模拟或提供类似的实现，以便在浏览器中运行代码时不会出现错误。这些模拟或提供的功能就是所谓的 "polyfill"，它们帮助确保代码在浏览器中正常运行。
 * 
 * 新版本的 Webpack 不再默认包含这些 polyfill
 * 鼓励开发者显式地配置和引入需要的 polyfill，以减小构建包的大小并提高性能
 * 
 * 为了解决 Webpack 中不包含 'path' 模块的 polyfill 
 * 告诉 Webpack 在需要时引入 'path-browserify' 模块来实现'path'功能，以填补 'path' 模块的功能缺失
 * 
 * 不需要 "fs" 模块，因此将 "fs" 设置为 false 
 */
module.exports = {
  configureWebpack: {
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify"),
        "fs": false
      }
    }
  }
}