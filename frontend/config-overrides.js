const webpack = require('webpack');

module.exports = {
  webpack: function(config, env) {
    // Completely remove HMR from the build
    config.plugins = config.plugins.filter(plugin => {
      return plugin.constructor.name !== 'HotModuleReplacementPlugin' &&
             plugin.constructor.name !== 'ReactRefreshPlugin';
    });

    // Override module.hot globally
    config.plugins.push(
      new webpack.DefinePlugin({
        'module.hot': 'undefined',
        'typeof module.hot': JSON.stringify('undefined')
      })
    );

    return config;
  },
  devServer: function(configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.hot = false;
      config.liveReload = false;
      config.client = config.client || {};
      config.client.overlay = false;
      config.client.webSocketURL = undefined;
      return config;
    };
  }
};
