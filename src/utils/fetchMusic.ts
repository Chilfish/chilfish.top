import NCM from 'NeteaseCloudMusicApi'
import type { NCMType, Song } from '~/types'

const {
  NCM_COOKIE = '',
  NCM_UID = 1,
} = import.meta.env

interface Data {
  playCount: number
  score: number
  song: Song
}

interface NCMResponse {
  weekData: Data[]
  allData: Data[]
  code: number
}

function parser(data: NCMResponse, type: NCMType) {
  return data[type].map(({ song, playCount, score }) => ({
    id: song.id,
    name: song.name,
    ar: song.ar.map(({ id, name }) => ({ id, name })),
    al: {
      id: song.al.id,
      name: song.al.name,
      picUrl: `${song.al.picUrl.replace('http://', 'https://')}?param=128y128`,
    },
    dt: song.dt,
    playCount,
    score,
  })).slice(0, 20)
}

export async function fetchMusic(type: NCMType) {
  try {
    const { body: data } = await NCM.user_record({
      uid: NCM_UID,
      cookie: NCM_COOKIE, // 似乎有特殊的使用方式
      type: (type === 'weekData' ? 1 : 0),
    })

    if (!data)
      return []

    return parser(data as unknown as NCMResponse, type)
  }
  catch (error: any) {
    console.error('/api/ncm: ', error)
    return []
  }
}
