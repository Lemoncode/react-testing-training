import webpack from '@cypress/webpack-preprocessor';
import webpackOptions from '../webpack.config';

export default (on, config) => {
  const options = {
    webpackOptions,
  };
  on('file:preprocessor', webpack(options));
};
