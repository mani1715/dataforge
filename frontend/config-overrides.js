const webpack = require('webpack');

module.exports = {
  webpack: function(config, env) {
    // Remove HMR completely
    config.plugins = config.plugins.filter(plugin => {
      return plugin.constructor.name !== 'HotModuleReplacementPlugin' &&
             plugin.constructor.name !== 'ReactRefreshPlugin';
    });

    // Disable module.hot
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
      
      // Completely disable WebSocket and HMR
      config.hot = false;
      config.liveReload = false;
      config.webSocketServer = false;
      config.client = {
        webSocketTransport: 'sockjs',
        webSocketURL: {
          hostname: '0.0.0.0',
          pathname: '/ws',
          port: 0,
        },
        overlay: false,
        progress: false,
      };
      
      return config;
    };
  }
};
