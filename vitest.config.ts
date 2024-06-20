import { defineConfig } from 'vitest/config';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [viteTsconfigPaths()],
  test: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '@/': new URL('./src/', import.meta.url).pathname
    }
  }
});
