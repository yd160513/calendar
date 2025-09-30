import { resolve } from 'path'
import { rmSync } from 'fs'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process';
import pkg from './package.json';
const { version } = pkg;

const commitId = execSync(`git rev-parse --short v${version}^{}`).toString().trim();

console.log('commitId:', commitId);

const cleanDistPlugin = () => ({
  name: 'clean-dist',
  buildStart() {
    try {
      // 只清理 renderer 相关目录，避免影响 electron-builder 生成的文件
      const rendererDist = resolve(__dirname, 'dist/renderer');
      rmSync(rendererDist, { recursive: true, force: true });
      console.log('已清理 renderer dist 目录');
    } catch (error) {
      console.warn('清理 dist 目录警告:', error);
    }
  }
});

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    define: {
      __COMMIT_ID__: JSON.stringify(commitId),
      __APP_VERSION__: JSON.stringify(pkg.version)
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), cleanDistPlugin()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/renderer/index.html'),
          reminder: resolve(__dirname, 'src/renderer/reminder.html')
        },
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]'
        }
      }
    }
  }
})
