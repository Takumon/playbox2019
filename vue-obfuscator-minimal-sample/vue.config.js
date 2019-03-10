var JavaScriptObfuscator = require('webpack-obfuscator')

module.exports = {
    configureWebpack: {
        plugins: [
            new JavaScriptObfuscator({
                rotateUnicodeArray: true
            })
        ]
    }
}