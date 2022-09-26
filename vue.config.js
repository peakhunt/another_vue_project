const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      //
      // XXX
      // it looks like there is a BUG in vue-cli-plugin-electron-builder
      // Without this customFileProtocol,
      // it generates an incorrect URL for WOFF/TTF files used in bundled CSS.
      // Problem is I really don't know what side effect this has.
      // Right now, this is the only working solution I've found so far.
      //
      customFileProtocol: './'
    }
  },
})
