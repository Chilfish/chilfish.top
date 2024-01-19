export * from './blog'
export * from './date'
export * from './fetchProjects'
export * from './fetchMusic'

export const linkTarget = (url?: string) => url?.startsWith('http') ? '_blank' : '_self'
