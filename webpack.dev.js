import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: './dist',
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true, // Shows runtime errors in the browser overlay
      },
    },
  },
});