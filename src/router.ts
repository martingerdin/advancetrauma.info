import { createRouter } from '@geajs/core'
import Home from './views/Home.tsx'
import NotFound from './views/NotFound.tsx'
import TMG from './views/TMG.tsx'

export const router = createRouter({
  '/': Home,
  '/tmg': TMG,
  '*': NotFound,
} as const)
