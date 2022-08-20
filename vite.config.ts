import defaultTheme from 'tailwindcss/defaultTheme'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import colors from 'tailwindcss/colors'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@font-family': ['Inter', ...defaultTheme.fontFamily.sans].join(','),
          '@text-color': colors.slate['800'],
          '@text-color-secondary': colors.slate['500'],
        },
      },
    },
  },
})
