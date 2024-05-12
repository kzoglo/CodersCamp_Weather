const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  },
  plugins: [
    new CopyPlugin([
      {
        from: 'src/assets/cityList/*.json',
        to: 'assets',
        transformPath() {
          return 'assets/cityList/cityList.json'
        }
      },
      {
        from: 'src/modules/weatherFiveDays/*.mst',
        to: 'modules/weatherFiveDays/',
        flatten: true
      },
      {
        from: 'src/modules/weatherToday/*.mst',
        to: 'modules/weatherToday/',
        flatten: true
      },
      {
        from: 'src/modules/weatherTomorrow/*.mst',
        to: 'modules/weatherTomorrow/',
        flatten: true
      },
      {
        from: 'src/assets/img/wind.gif',
        to: 'assets/img',
        flatten: true
      },
      {
        from: 'src/assets/img/weather.png',
        to: 'assets/img',
        flatten: true
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'assets/img'
          }
        }
      }
    ]
  }
}
