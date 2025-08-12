const { defineConfig, mergeConfig } = require('vitest/config');
const viteConfig = require('./vite.config.cjs');

module.exports = mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
}));
