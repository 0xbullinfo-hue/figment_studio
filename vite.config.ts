import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const lockedLegacyAsset = 'figment_media/3D-Apartment-Rendering-Lagos-state.png';

function copyPublicAssetsWithoutLockedFile() {
  return {
    name: 'copy-public-assets-without-locked-file',
    closeBundle() {
      const publicRoot = path.resolve(__dirname, 'public');
      const outputRoot = path.resolve(__dirname, 'dist');

      const copyDirectory = (sourceDirectory: string, outputDirectory: string, relativeDirectory = '') => {
        fs.mkdirSync(outputDirectory, { recursive: true });
        for (const entry of fs.readdirSync(sourceDirectory, { withFileTypes: true })) {
          const relativePath = path.posix.join(relativeDirectory, entry.name);
          const sourcePath = path.join(sourceDirectory, entry.name);
          const outputPath = path.join(outputDirectory, entry.name);

          if (relativePath === lockedLegacyAsset) {
            continue;
          }

          if (entry.isDirectory()) {
            copyDirectory(sourcePath, outputPath, relativePath);
          } else {
            fs.copyFileSync(sourcePath, outputPath);
          }
        }
      };

      copyDirectory(publicRoot, outputRoot);
    },
  };
}

export default defineConfig(({ mode }) => {
  loadEnv(mode, '.', '');
  return {
    server: {
      port: 3005,
      host: '0.0.0.0',
    },
    plugins: [react(), copyPublicAssetsWithoutLockedFile()],
    build: {
      copyPublicDir: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
