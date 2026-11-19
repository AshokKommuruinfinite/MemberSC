import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { syncContent, getContentDirectory } from './scripts/sync-content.mjs';

function watchMemberContent() {
  return {
    name: 'membersc-json-watcher',
    buildStart() { syncContent({ silent: true }); },
    configureServer(server) {
      const directory = getContentDirectory();
      server.watcher.add(directory);
      const handleChange = (file) => {
        if (!file.endsWith('.json') || !path.resolve(file).startsWith(directory + path.sep)) return;
        syncContent({ silent: true });
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('change', handleChange);
      server.watcher.on('add', handleChange);
      server.watcher.on('unlink', handleChange);
    }
  };
}

export default defineConfig({
  plugins: [react(), watchMemberContent()],
  server: { port: 5173, strictPort: false },
  build: { outDir: 'dist' }
});
