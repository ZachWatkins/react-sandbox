import react from '@vitejs/plugin-react-swc'
import eslint from 'vite-plugin-eslint'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react(), eslint()],
    test: {
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
    },
})
