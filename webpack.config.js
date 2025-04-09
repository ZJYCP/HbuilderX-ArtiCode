const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { getProjectVersion, getCommitHash } = require('./scripts/get_version');
const { DefinePlugin } = require('webpack');
const { GenerateVersionFilePlugin } = require('./scripts/webpack_plugins');

const version = JSON.stringify(getProjectVersion());
const webViewConfig = {
  mode: 'production',

  entry: {
    app: './src/webview/index.tsx',
  },

  output: {
    path: path.resolve(__dirname, 'dist/webview'),
    // filename: (pathData) => {
    //   if (pathData.chunk.name === 'app') {
    //     return 'bundle.js'; // 固定主入口的文件名
    //   }
    //   return '[name].[contenthash].js'; // 其他文件继续使用hash
    // },
    filename: 'bundle.js',
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.scss'],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 4, // 使用4个CPU核心打包
            },
          },
          {
            loader: 'swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
          // {
          //   loader: 'babel-loader',
          //   options: {
          //     presets: [
          //       [
          //         '@babel/preset-env',
          //         {
          //           targets: '> 0.5%, last 2 versions, Chrome 90',
          //         },
          //       ],
          //       [
          //         '@babel/preset-react',
          //         {
          //           runtime: 'automatic', // ✅ 自动引入 React，避免 React is not defined
          //         },
          //       ],
          //       '@babel/preset-typescript',
          //     ],
          //   },
          // },
        ],
      },
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader', // 把 CSS 插入到 DOM 中
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
                localIdentName: '[local]__[hash:base64:5]',
              },
              importLoaders: 2,
            },
          },
          'sass-loader', // 编译 SCSS 文件
        ],
      },
      {
        test: /\.css$/, // 适用于所有 .css 文件
        use: [
          'style-loader', // 将 CSS 加载到页面中
          'css-loader', // 解析 CSS 文件
          'postcss-loader', // 使用 postcss 处理 Tailwind CSS
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/webview/index.html', // 指定 HTML 模板
      filename: 'index.html',
    }),
    new DefinePlugin({
      'process.env.FRONT_APP_VERSION': version,
      'process.env.sha': JSON.stringify(getCommitHash()),
    }),
    new GenerateVersionFilePlugin(version),
  ],

  cache: {
    type: 'filesystem', // 启用文件缓存
    cacheDirectory: path.resolve(__dirname, '.webpack_cache'),
  },

  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendor',
  //         chunks: 'all',
  //       },
  //     },
  //   },
  // },

  // 配置devserve
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/webview'),
    },
    compress: true, // 启用 gzip 压缩
    port: 3001, // 端口号
    open: false, // 自动打开浏览器
    hot: true, // 启用热更新
    historyApiFallback: true, // 支持 React Router 的 HTML5 History API
  },

  // devtool: 'source-map',

  externals: {
    hbuilderx: 'commonjs hbuilderx',
  },
};

module.exports = [webViewConfig];
