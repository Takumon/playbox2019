module.exports = {
  mode: 'spa',
  // apollo moduleを追加
  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/dotenv'
  ],
  // 設定追加
  apollo: {
    clientConfigs: {
      default: '~/apollo/client-configs/default.js',
    }
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'nuxt-graphql-sample',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

