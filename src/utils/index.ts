export * from './post'
export * from './date'
export * from './fetchMusic'

export const linkTarget = (url?: string) => url?.startsWith('http') ? '_blank' : '_self'
