const path = require("path");

module.exports = {
  devServer: {
    port: 8002,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  chainWebpack: config => {
    config.module
      .rule('js')
      .test(/\.m?js$/)
      .exclude.add(/node_modules\/(?!vis-data)/)
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .tap(options => {
        return {
          ...options,
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'entry',
                corejs: 3
              }
            ]
          ]
        };
      });
  },
  configureWebpack: {
    resolve: {
      alias: {
        "assets": "@/assets",
      },
    },
    module: {
      rules: [
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配视频和音频文件
          use: [
            {
              loader: 'url-loader', // 使用 url-loader
              options: {
                limit: 10240, // 10KB，超过这个大小的文件将被处理为单独的文件
                name: '[name].[hash].[ext]', // 输出文件名格式
                outputPath: 'videos/', // 输出路径
              },
            },
          ],
        },
        {
          test: /\.js$/, // 匹配 JavaScript 文件
          exclude: /node_modules/, // 排除 node_modules
          use: {
            loader: 'babel-loader', // 使用 Babel 加载器
            options: {
              presets: ['@babel/preset-env'], // 确保支持最新的 JavaScript 特性
            },
          },
        },
      ],
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(pdf)(\?.*)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/pdf/[name].[hash:8].[ext]', // 文件输出路径和命名规则
              },
            },
          ],
        },
      ],
    },
  },


  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/assets/css/common.scss";`
      }
    }
  }
};