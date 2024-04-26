import dns from 'dns'

import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'

// NOTE TO DEVELOPERS: This config is not actually being applied at the moment, as webpack is still specified
// as the bundler in redwood.toml. When we update the project to use vite as the bundler, please remove this comment
// and also delete the webpack.config.js file :)

// See: https://vitejs.dev/config/server-options.html#server-host
// So that Vite will load on local instead of 127.0.0.1
dns.setDefaultResultOrder('verbatim')

import redwood from '@redwoodjs/vite'

const viteConfig: UserConfig = {
  plugins: [redwood()],
}

export default defineConfig(viteConfig)
