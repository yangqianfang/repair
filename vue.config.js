const glob = require('glob')
const path = require('path')
const fs = require('fs')
const config = {
    pages: Object.assign(getPages())
}
function getPages() {
    const pages = {}
    glob.sync('./src/pages/**/index.vue').forEach(function(pageUrl) {
        // pageUrl 路径 ./src/pages/index/index.vue
        // const ext = path.extname(pageUrl) //文件扩展名
        const filepath = path.dirname(pageUrl) //./src/pages/index
        // let pageCode = path.basename(pageUrl, ext) //提取文件名称 index.vue =>index
        let allpath = filepath.replace('./src/pages/', '') //index/user
        let pathArry = allpath.split('/')
        let pageCode = pathArry[pathArry.length - 1] //目录名作为生成的文件名
        let outputpath = allpath.replace(pageCode, '')
        // console.log(pageUrl)
        // 生成入口文件
        const entryFile = `./entry/${pageCode}.js`
        fs.exists(entryFile, function(exists) {
            if (exists) return
            // 创建文件及写入文件内容
            const appTpl = '.' + pageUrl
            const entryData = `import Vue from 'vue';\nimport App from '${appTpl}';\nVue.config.productionTip = false;\nnew Vue({ render: h => h(App) }).$mount('#app'); `
            fs.writeFile(entryFile, entryData, function(err) {
                // err.code === 'ENOENT'
                if (err) console.log(err)
            })
        })
        pages[pageCode] = {
            entry: entryFile, // 入口文件
            // template: "./public/index.html", // 模板文件
            filename: `${outputpath}${pageCode}.html`, // 打包后的文件路径
            minify: true, // 是否压缩
            chunks: ['chunk-vendors', 'chunk-common', 'app', pageCode], // 引入资源文件
            chunksSortMode: 'manual' // 控制 chunk 的排序。none | auto（默认）| dependency（依赖）| manual（手动）| {function}
        }
    })

    return pages
}

module.exports = config
