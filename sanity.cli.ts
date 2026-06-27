import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '5hujwuzl',
    dataset: 'production',
  },
  typegen: {
    path: './{app,components,sanity}/**/*.{ts,tsx,js,jsx}',
    schema: './schema.json',
    generates: './sanity.types.ts',
  },
})
