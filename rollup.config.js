import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from "rollup-plugin-babel"
import { terser } from 'rollup-plugin-terser'
import rimraf from 'rimraf'
import pkg from './package.json'

const input = 'src/main.js'  //入口文件
const globalName = 'myapp'   //umd全局变量
const name = 'myapp'         //打包名称
const banner = `/*@Author: ${pkg.author}, createTime: ${new Date().toLocaleString()}, version: ${pkg.version}*/`
const dev = process.env.NODE_ENV === 'dev'

if (!dev) {
  rimraf.sync('lib')
}

const umdConfigMin = {
  input,
  output: {
    name: globalName,
    file: `lib/${name}-${pkg.version}.umd.min.js`,
    format: 'umd',
    banner
  },
  plugins: [
    json(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // 防止打包node_modules下的文件
      runtimeHelpers: true,       // 使plugin-transform-runtime生效
    }),
    terser({
      format: {
        comments: function (node, comment) {
          var text = comment.value
          var type = comment.type
          if (type == "comment2") {
            return /@Author/i.test(text)
          }
        },
      },
    }),
  ]
}

const umdConfig = {
  input,
  output: {
    name: globalName,
    file: `lib/${name}-${pkg.version}.umd.js`,
    format: 'umd',
    banner
  },
  plugins: [
    json(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
  ]
}

const esmConfig = {
  input,
  output: {
    file: `lib/${name}-${pkg.version}.esm.js`,
    format: 'es',
    banner
  },
  plugins: [
    json(),
    resolve(),
    commonjs(),
  ]
}

const cjsConfig = {
  input,
  output: {
    file: `lib/${name}-${pkg.version}.cjs.js`,
    format: 'cjs',
    exports: 'auto',
    banner
  },
  plugins: [
    json(),
    resolve(),
    commonjs(),
  ]
}

export default dev ? [esmConfig, cjsConfig] : [umdConfig, umdConfigMin, esmConfig, cjsConfig]