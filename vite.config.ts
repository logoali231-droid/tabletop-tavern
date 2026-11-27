import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const extraAllowedHosts = (process.env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS ?? '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: extraAllowedHosts.length > 0 ? extraAllowedHosts : undefined,
  },
});
