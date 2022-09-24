import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import electron from 'vite-plugin-electron';

export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: 'main/index.ts',
      },
      preload: {
        input: path.join(__dirname, 'main/preload.ts'),
      },
    }),
  ],
  build: {
    // 必须配置，否则electron相关文件将不会生成build后的文件
    emptyOutDir: false,
    chunkSizeWarningLimit: 1600,
  },
});