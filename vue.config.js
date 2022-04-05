// vue.config.js

let publicPath = '/';

switch(process.env.NODE_ENV){
    case 'staging':
        publicPath = '/web-explorer-vuejs'
        break;
    case 'production':
        publicPath = ''
        break;
    case 'development':
        publicPath = '/'
        break;
}


module.exports = {
    publicPath: publicPath,
    assetsDir: './assets/',
    devServer: {
      host: 'localhost'
    },
    pluginOptions: {
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: '/assets/locales',
        enableLegacy: false,
        runtimeOnly: false,
        compositionOnly: false,
        fullInstall: true
      }
    },
    chainWebpack: config => {
      config
          .plugin('html')
          .tap(args => {
              args[0].title = "ProximaX Sirius Explorer";
              return args;
          })
    }
}
