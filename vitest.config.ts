import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    reporters: ['default', 'junit', 'verbose'],
    outputFile: {
      junit: './coverage/junit.xml',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'cobertura'],
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.spec.ts', 'dist/**'],
    },
  },
});
