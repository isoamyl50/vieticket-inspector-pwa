import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    // depending on your application, base can also be "/"
    base: '/',
    plugins: [
        react(),
        viteTsconfigPaths(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,svg,mp3}']
            },
            manifest: false
        }),
    ],
    server: {
        // this ensures that the browser opens upon server start
        open: false,
        // this sets a default port to 3000  
        port: 3000,

    },
})