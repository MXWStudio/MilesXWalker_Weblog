import type { ConfigFunction } from '@babel/core'

const config: ConfigFunction = () => ({
  presets: [
    '@vue/app'
  ]
})

export default config 