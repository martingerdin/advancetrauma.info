import { createRouter } from '@geajs/core'
import Home from './views/Home.tsx'
import NotFound from './views/NotFound.tsx'

export const router = createRouter({
  '/': Home,
  '*': NotFound,
} as const)
