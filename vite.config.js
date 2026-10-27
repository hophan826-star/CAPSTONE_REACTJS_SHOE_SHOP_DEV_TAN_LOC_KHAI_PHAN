import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react()];

  // npm start => chạy https://localhost:3000 để test đăng nhập Facebook (Facebook bắt buộc https)
  // giống thầy thêm "start": "set HTTPS=true&&react-scripts start" trong demo (create-react-app),
  // nhưng Vite không đọc biến HTTPS nên phải dùng plugin basic-ssl
  if (mode === 'https') {
    const { default: basicSsl } = await import('@vitejs/plugin-basic-ssl');
    plugins.push(basicSsl());
  }

  return {
    plugins,
    server: mode === 'https' ? { port: 3000 } : {},
  };
});
