# hello-world-vue

webpack-obfuscatorを使って難読化できるか調査


## 検証手順

* プロジェクト作成

```
vue create hello-world-vue
cd hello-world-vue
npm i -D webpack-obfuscator
```

* プロジェクト直下にvue.config.js作成

```javascript
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
```

* `npm run build`でビルドした

* 上記ビルド資産を別の場所に保存しておく

* `vue.config.js`を削除して`npm run build`

* 上記ビルド資産を別の場所に保存しておく

* ビルド資産をクローム開発者ツールでフォーマットして比較


## 検証結果

難読化されてるっぽい。ビルドサイズは難読化されてるほうが大きくなる。


### webpack-obfuscatorを使用しない場合

```
  File                                 Size               Gzipped

  dist\js\chunk-vendors.b1b83085.js    65.03 KiB          23.39 KiB
  dist\js\app.0fc8b790.js              4.56 KiB           1.63 KiB
  dist\css\app.e2713bb0.css            0.33 KiB           0.23 KiB
```

[メインのJSファイル](./artifacts.app.normal.js)
[全てのファイル](./artifacts_normal)

### webpack-obfuscatorを使用した場合

```
  File                                 Size               Gzipped

  dist\js\chunk-vendors.b1b83085.js    90.98 KiB          28.14 KiB
  dist\js\app.e7bc1c21.js              6.30 KiB           2.04 KiB
  dist\css\app.e2713bb0.css            0.33 KiB           0.23 KiB
```

* [メインのJSファイル](./artifacts.app.obfuscator.js)
* [全てのファイル](./artifacts_obfuscator)