import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

const isStandalone = process.env.BUILD_MODE === 'standalone';

export default defineConfig({
  plugins: [dts({ include: ['src'], exclude: ['src/standalone.ts'] })],
  build: {
    lib: {
      entry: resolve(__dirname, isStandalone ? 'src/standalone.ts' : 'src/index.ts'),
      name: 'KeyOSD',
      formats: ['es', 'umd'],
      fileName: (format) => {
        const base = isStandalone ? 'keyosd.standalone' : 'keyosd';
        return `${base}.${format === 'es' ? 'js' : 'umd.cjs'}`;
      },
    },
    rollupOptions: {
      output: {
        assetFileNames: 'keyosd.[ext]',
      },
    },
  },
});
