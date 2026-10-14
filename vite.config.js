import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const defaultOrigin = 'https://ea.csweekly.ru'
  const configuredUrl = process.env.VITE_SITE_URL || env.VITE_SITE_URL || env.SITE_URL || defaultOrigin
  let publicOrigin = ''
  if (configuredUrl) {
    const url = new URL(configuredUrl)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      throw new Error('SITE_URL должен содержать адрес сайта вида https://birthday.ru без пути, параметров и пароля.')
    }
    publicOrigin = url.origin
  }

  return {
    plugins: [
      vue(),
      {
        name: 'social-preview-urls',
        transformIndexHtml(html) {
          // Метаданные входят в исходный HTML, поэтому роботам не нужен JavaScript.
          return html.replaceAll(defaultOrigin, publicOrigin)
        }
      }
    ]
  }
})
