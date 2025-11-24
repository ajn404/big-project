const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

// NestJS webpack配置
const webpackConfig = {
  mode: 'production',
  target: 'node',
  entry: path.resolve(__dirname, '../src/main.ts'),
  output: {
    path: path.resolve(__dirname, '../dist-analyze'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      openAnalyzer: true,
      analyzerPort: 8889,
      reportFilename: 'bundle-report.html',
      generateStatsFile: true,
      statsFilename: 'bundle-stats.json',
    }),
  ],
  externals: {
    // 排除Node.js内置模块
    'aws-sdk': 'aws-sdk',
    'sqlite3': 'sqlite3',
    'pg': 'pg',
    'pg-native': 'pg-native',
    'mysql': 'mysql',
    'mysql2': 'mysql2',
    'oracledb': 'oracledb',
    'tedious': 'tedious',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        nestjs: {
          test: /[\\/]node_modules[\\/]@nestjs/,
          name: 'nestjs',
          priority: 20,
        },
        apollo: {
          test: /[\\/]node_modules[\\/](apollo|graphql)/,
          name: 'apollo',
          priority: 15,
        },
        typeorm: {
          test: /[\\/]node_modules[\\/]typeorm/,
          name: 'typeorm',
          priority: 10,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 5,
        },
      },
    },
  },
};

console.log('🔍 开始分析后端bundle...');
console.log('📦 输出目录:', webpackConfig.output.path);

// 确保输出目录存在
if (!fs.existsSync(webpackConfig.output.path)) {
  fs.mkdirSync(webpackConfig.output.path, { recursive: true });
}

webpack(webpackConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error('❌ Bundle分析失败:');
    if (err) {
      console.error(err);
    }
    if (stats && stats.hasErrors()) {
      console.error(stats.toString());
    }
    process.exit(1);
  }

  console.log('✅ Bundle分析完成!');
  console.log('🌐 分析结果将在浏览器中自动打开: http://localhost:8889');
  console.log('📄 报告文件: dist-analyze/bundle-report.html');
  console.log('📊 统计数据: dist-analyze/bundle-stats.json');
});