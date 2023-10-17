import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vitePluginImport from 'vite-plugin-babel-import';
import path from 'path';
import copy from 'rollup-plugin-copy';
import topLevelAwait from 'vite-plugin-top-level-await';
import DefineOptions from 'unplugin-vue-define-options/vite';
const baseUrl = {
  development: './',
  sit: './',
  beta: './',
  prod: './',
};
const getBaseByMode = (mode) => {
  console.log(
    `========================${mode}环境开始打包============================`
  );
  return baseUrl[mode];
};
export default ({ mode }) =>
  defineConfig({
    plugins: [
      vue(),
      DefineOptions(),
      topLevelAwait({
        // The export name of top-level await promise for each chunk module
        promiseExportName: '__tla',
        // The function to generate import names of top-level await promise in each chunk module
        promiseImportName: (i) => `__tla_${i}`,
      }),
    ],
    base: getBaseByMode(mode),
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve(
              'src/assets/css/base.less'
            )}";`,
          },
          javascriptEnabled: true,
        },
      },
    },
    build: {
      outDir: 'diyadmin',
    },
    server: {
      hmr: true,
      proxy: {
        '/diyadmin': {
          target: 'http://43.159.137.119:8083/',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/saascloud/, 'saascloud'),
        },
      },
    },
  });
