export * from './date'
export * from './fetchMusic'
export * from './post'

export const linkTarget = (url?: string) => url?.startsWith('http') ? '_blank' : '_self'
