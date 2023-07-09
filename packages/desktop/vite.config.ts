import { UserConfigExport, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsConfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import * as path from 'path';

const config: UserConfigExport = {
  base: path.join(__dirname, "../.."),
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@lili-project/lili-store': path.join(__dirname, "../..", "packages/lili-store/src/index.ts"),
      '@lili-project/shared-ui': path.join(__dirname, "../..", "packages/shared-ui/src/index.ts"),
    },
  },
  plugins: [
    dts({
      entryRoot: 'src',
      tsConfigFilePath: path.join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
    }),
    react(),
    viteTsConfigPaths({
      // root: '../../',
      root: __dirname,
    }),
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    fs: {
      allow: ["../.."],
    },
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
};

// https://vitejs.dev/config/
export default defineConfig(config);
