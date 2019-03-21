# 使用说明

## 项目依赖安装
```
npm install
```

### 开发模式
```
npm run dev
```

### 产品打包模式
```
npm run build
```

### 测试模式
```
npm run test
```

### Lint模式
```
npm run lint
```

# 项目配置过程


## 必要的库

首先初始化项目

```shell
npm init
```

安装必要的库

```shell
npm install -S vue vue-router
```

然后是构建工具，在webpack4中需要单独安装cli

```shell
npm install -D webpack webpack-cli
```



## 项目结构

- main.js: 是应用的入口
- src目录：存放代码
- App.vue：存放根组件
- views：存放所有顶层组件
- router.js：存放路由
- stores：存放vuex的actions/mutations
- assets：存放图片
- shared：存放共享组件

接下来需要配置webpack来打包整个应用，webpack通过entry来构建整个依赖图，使用不同的loaders来加载文件.

```shell
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.vue
│   ├── assets
│   ├── layout
│   ├── main.js
│   ├── router.js
│   ├── shared
│   ├── stores
│   └── views
└── webpack.config.dev.js

```



## Webpack配置

### 开发配置

编写开发中使用的配置。

1. 将mode改为development
2. 入口entry设置为'./'
3. 安装vue-loader（导入单文件组件形式的`.vue`文件)、vue-template-compiler（用于编译vue模版，生成渲染函数）、vue-style-loader（style-loader的改版，style-loader用于将css打包放入\<style\>标签中）、css-loader（将`url()`、`@import`的代码导入）

在`.vue`文件中如果需要`import xx from '@/icons'`，需要设置路径别名，

```js
resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 定义@为src目录，import xx from '@/icons' 相当于 from 'src/icons'
    },
}
```

一般看到的代码不需要`import xx from '@/icons.vue'`这是因为在resolve中指定了默认的扩展名.

```js
resolve: {
    extensions: ['.js', '.vue']  // 这样就不需要在import from中写尾缀
}
```

### Vue-loader

vue-loader将`.vue`文件拆分后需要根据不同的代码来调用指定的loader，这个拦截操作是由`VueLoaderPlugin`实现，比如`<script>`中的代码，会应用在`test: /\.js$/`的加载器

```js
const { VueLoaderPlugin } = require('vue-loader')
module.exports = {
  plugins:[
    new VueLoaderPlugin()
  ]
}
```



### SASS

为支持Sass，需要安装相关加载器sass-loader

```shell
npm install sass-loader node-sass webpack --save-dev	
```

写入配置，loader执行从下到上执行

```js
      {
        test: /\.css|\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
```



### SVG导入

因为icon都是svg格式文件，需要使用加载器导入，这里使用svg-sprite-loader，将svg导入为svg雪碧图。

```js
npm install svg-sprite-loader -D
```

```js
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          symbolId: 'icon-[name]'  // 指定id，svg use使用id来引用其他svg
        }
      }
```

### Dev-server

每次修改都需要手动执行`webpack --config webpack.config.dev.js`很麻瓜，还要webpack能够使用webpack-dev-server。

首先安装一波

```js
npm install --save-dev webpack-dev-server
```

修改原来的command

```json
原来的
"dev": "webpack --config webpack.config.dev.js"
新的
"dev": "webpack-dev-server --config webpack.config.dev.js"
```



### JS文件注入

需要把构建好的文件自动注入到index.html中

```shell
npm install --save-dev html-webpack-plugin
```

在webpack.config.dev.js中新增

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  plugins:[
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      favicon: 'favicon.ico',
      inject: true
    })
  ]
}
```

### HMR

现在就能修改文件后会自动编译刷新，但这样的整页刷新有点捞，使用webpack自带的HotModuleReplacementPlugin来实现热替换。

```js
const webpack = require('webpack')
module.exports = {
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
  ]
}
```



### ES6语法

为了支持es6语法，需要安装babel转译器

```js
npm install --save-dev @babel/core babel-loader @babel/preset-env
```

在webpack.config.dev.js新增

```js
			{
        test: /\.js%/,
        use: 'babel-loader'
      }
```

添加`.babelrc`，填入下面的代码

```json
{
  "presets": [
    ["@babel/env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }]
  ]
}
```



### 代码风格

为了规范代码风格，使用eslint

首先是安装

```shell
npm install --save-dev eslint eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard eslint-config-standard babel-eslint eslint-loader eslint-plugin-vue
```

在根目录创建.eslintrc.js，填写规范

```js
module.exports = {
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/recommended',
    'standard'
  ],
  plugins: [
    'vue'
  ]
}
```

在package.json中添加新命令`"lint": "eslint --ext .js,.vue src"`



### 静态文件处理

将它们拷贝到dist目录

```
npm install --save-dev copy-webpack-plugin
```

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  plugins:[
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'src', 'assets'), to: path.join(__dirname, 'dist/static/img'), toType: 'dir'}
    ])
  ]
}
```



### 测试

Vue.js的官方单元测试是vue-test-utils，教程https://vue-test-utils.vuejs.org/

安装依赖

```shell
npm install --save-dev jest babel-jest vue-jest jest-serializer-vue @vue/test-utils

```

Jest: 是单元测试驱动器，vue-jest将单文件组件转换为jest的格式，jest-serializer-vue提供vue组件快照功能。因为测试是跑在node环境，所以新语法需要使用babel-jest，然后提供jest.transform配置。在webpack中使用`babel-preset-env`，babel会默认关闭es module的转译，因为webpack默认支持，所以需要开启。

向package.json文件添加下面的配置

```json
"scripts": {
    "test": "jest",    
  },
"jest": {
  "moduleFileExtensions": [
    "js",
    "vue"
  ],
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  "transform": {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
  },
  "snapshotSerializers": [
    "<rootDir>/node_modules/jest-serializer-vue"
  ]
}

```

在使用时遇到

```
 FAIL  src/__tests__/App.spec.js
  ● Test suite failed to run

    Cannot find module 'babel-core'

    However, Jest was able to find:
        '../App.vue'
```

因为我的babel太新了，所以vue-jest的require('babel-core')是老babel写法。将vue-jest/compilers/babel-compiler.js中改为require('@babel/core')



### 提取CSS

将vue单组件文件中的css部分提取到单独的css文件中

```shell
npm install --save-dev mini-css-extract-plugin
```

在webpack中添加相关plugin

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
{
        test: /\.css|\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'vue-style-loader'
          'css-loader',
          'sass-loader'
        ]
 },
```



### 环境分离

将webpack配置分为develop和production两个，首先将原有文件改为webpack.config.comm.js，安装clean-webpack-plugin、webpack-merge

```shell
npm install --save-dev clean-webpack-plugin webpack-merge
```

新增clean-webpack-plugin配置到webpack.config.comm.js

```js
plugins: [
    new CleanWebpackPlugin(),
]
```

- 新建webpack.config.dev.js将devServer相关代码复制进来，使用webpack-merge合并webpack.config.comm.js
- 新建webpack.config.prod.js将mode改为 'production'，使用webpack-merge合并webpack.config.comm.js

修改package.json

```json
"scripts": {
    "dev": "webpack-dev-server --config webpack.config.dev.js --color",
    "build": "webpack --config webpack.config.prod.js --color",
    "test": "jest",
    "lint": "eslint --ext .js,.vue src"
  },
```

使用`npm run build `用于打包应用，`npm run dev`用于开发

<<<<<<< HEAD
### SASS全局变量
=======
### 美化构建过程

安装相关组件主要是不显示webpack自带的输出，而是改为`friendly-errors-webpack`来输出

`npm install friendly-errors-webpack-plugin --save-dev`

```js
 devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: false,
    hot: true,
    open: 'Chrome',
    quiet: true, // 不显示devServer信息
    overlay: true // 编译出现错误时将错误显示在页面中
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['Application running in http://localhost:8080/']
      },
      clearConsole: true
    })
  ]
```

>>>>>>> 57d7248190aac887d5d32f49c8400ba816df111f

因为需要对一些颜色啥的统一起来，所以将它们放到`src/styles/index.scss`中，然后在组件里直接使用这些变量就行。这个功能需要`npm install -S sass-resources-loader`

然后在css、scss的加载器前添加它，resources选项就是指明那些全局变量的地址。

```js
    rules: [
      {
        test: /\.css|\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(__dirname, './src/styles/index.scss')
            }
          }
        ]
      }
    ]
```



## 

## 最终配置

请参考我的github仓库[vue-webpack](https://github.com/ssdemajia/vue-webpack/)



## 参考

https://itnext.io/vuejs-and-webpack-4-from-scratch-part-1-94c9c28a534a

https://itnext.io/vue-js-and-webpack-4-from-scratch-part-2-5038cc9deffb

https://itnext.io/vue-js-and-webpack-4-from-scratch-part-3-3f68d2a3c127
