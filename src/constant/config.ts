export const isDev = import.meta.env.DEV

export const host = 'https://chilfish.top'
export const githubHost = 'https://github.com/Chilfish'

export const localImgHost = 'http://localhost:5173'
export const imgHost = isDev ? localImgHost : 'https://p.chilfish.top'

export const pageSize = 16
