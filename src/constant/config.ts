export const isDev = import.meta.env.DEV

export const host = 'https://chilfish.top'
export const githubHost = 'https://github.com/Chilfish'

export const localImgHost = 'https://static.localhost'
const remoteImgHost = 'https://p.chilfish.top'

export const imgHost = isDev ? localImgHost : remoteImgHost

export const pageSize = 16
